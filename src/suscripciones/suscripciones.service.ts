import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoConfig } from 'mercadopago';
import { randomUUID } from 'crypto';

const PLAN_MAP: Record<string, { planId: number; periodo: string }> = {
  'd9333165a97b4e60a9b87f27b13c6676': { planId: 1, periodo: 'mensual' },
  'f597ba1d700440b7b40139c8060f78dc': { planId: 1, periodo: 'anual'   },
  '00418792d857442da35980be23928b2a': { planId: 2, periodo: 'mensual' },
  '055a8d3ffb0f403eb1376ed38adde4ba': { planId: 2, periodo: 'anual'   },
};

@Injectable()
export class SuscripcionesService {
  private mp: MercadoPagoConfig;
  private readonly logger = new Logger(SuscripcionesService.name);

  constructor(private prisma: PrismaService) {
    this.mp = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }

  async obtenerSuscripcion(docenteId: number) {
    const suscripcion = await this.prisma.suscripcion.findUnique({
      where: { docenteId },
      include: { plan: true },
    });

    if (!suscripcion) return { estado: 'sin_suscripcion', plan: null, diasRestantes: null };

    const diasRestantes = suscripcion.fechaFin
      ? Math.ceil(
          (new Date(suscripcion.fechaFin).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return { ...suscripcion, diasRestantes };
  }

  async crearCheckout(planMpId: string, docenteId: number) {
    const planInfo = PLAN_MAP[planMpId];
    if (!planInfo) throw new Error('Plan no reconocido');

    // Generar código único para identificar al docente en el webhook
    const codigo = randomUUID();

    // Guardar código pendiente en BD
    await this.prisma.suscripcionPendiente.create({
      data: { codigo, docenteId, planMpId },
    });

    this.logger.log(`Código generado para docente ${docenteId}: ${codigo}`);

    // Activar suscripción inmediatamente
    const fechaFin = planInfo.periodo === 'anual'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30  * 24 * 60 * 60 * 1000);

    const suscripcionExistente = await this.prisma.suscripcion.findUnique({
      where: { docenteId },
    });

    if (suscripcionExistente) {
      await this.prisma.suscripcion.update({
        where: { docenteId },
        data: {
          estado:        'activa',
          planId:        planInfo.planId,
          periodo:       planInfo.periodo,
          proveedor:     'mercadopago',
          fechaFin,
          actualizadoEn: new Date(),
        },
      });
    } else {
      await this.prisma.suscripcion.create({
        data: {
          docenteId,
          planId:         planInfo.planId,
          estado:         'activa',
          proveedor:      'mercadopago',
          periodo:        planInfo.periodo,
          fechaInicio:    new Date(),
          fechaFin,
          autoRenovacion: true,
        },
      });
    }

    this.logger.log(`Suscripción activada para docente ${docenteId}`);

    // Armar URL con external_reference = código único
    const checkoutUrl = `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${planMpId}&external_reference=${codigo}`;

    return { checkoutUrl };
  }

  async activarPlanGratis(docenteId: number) {
    const planGratis = await this.prisma.plan.findFirst({
      where: { nombre: 'Gratis', activo: true },
    });

    if (!planGratis) throw new Error('Plan Gratis no configurado');

    const suscripcionExistente = await this.prisma.suscripcion.findUnique({
      where: { docenteId },
    });

    if (suscripcionExistente) {
      await this.prisma.suscripcion.update({
        where: { docenteId },
        data: {
          estado:         'activa',
          planId:         planGratis.id,
          periodo:        'gratis',
          proveedor:      'gratis',
          fechaFin:       null,
          autoRenovacion: false,
          actualizadoEn:  new Date(),
        },
      });
    } else {
      await this.prisma.suscripcion.create({
        data: {
          docenteId,
          planId:         planGratis.id,
          estado:         'activa',
          proveedor:      'gratis',
          periodo:        'gratis',
          fechaInicio:    new Date(),
          fechaFin:       null,
          autoRenovacion: false,
        },
      });
    }

    this.logger.log(`Plan gratis activado para docente ${docenteId}`);

    return { ok: true };
  }
}