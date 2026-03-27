
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';
 
const PLAN_MAP: Record<string, { planId: number; periodo: string }> = {
  'd9333165a97b4e60a9b87f27b13c6676': { planId: 1, periodo: 'mensual' },   // Básico Mensual
  'f597ba1d700440b7b40139c8060f78dc': { planId: 1, periodo: 'anual'   },   // Básico Anual
  '00418792d857442da35980be23928b2a': { planId: 2, periodo: 'mensual' },   // Plus Mensual
  '055a8d3ffb0f403eb1376ed38adde4ba': { planId: 2, periodo: 'anual'   },   // Plus Anual
};
 
@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private mp: MercadoPagoConfig;
 
  constructor(private prisma: PrismaService) {
    this.mp = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }
 
  async procesarNotificacion(body: any) {
    this.logger.log(`Webhook recibido: ${JSON.stringify(body)}`);
 
    // MercadoPago envía distintos tipos de notificaciones
    const tipo = body.type || body.topic;
    const id   = body.data?.id || body.id;
 
    if (!tipo || !id) {
      this.logger.warn('Notificación sin tipo o id');
      return { ok: true };
    }
 
    if (tipo === 'subscription_preapproval' || tipo === 'preapproval') {
      await this.procesarSuscripcion(id);
    }
 
    return { ok: true };
  }
 
  private async procesarSuscripcion(preapprovalId: string) {
    try {
      const client     = new PreApproval(this.mp);
      const preapproval = await client.get({ id: preapprovalId }) as any;
 
      this.logger.log(`PreApproval status: ${preapproval.status}`);
      this.logger.log(`PreApproval payer: ${JSON.stringify(preapproval.payer_email)}`);
 
      const email      = preapproval.payer_email;
      const planMpId   = preapproval.preapproval_plan_id;
      const estado     = preapproval.status; // authorized, paused, cancelled
 
      if (!email || !planMpId) {
        this.logger.warn('Sin email o planId en preapproval');
        return;
      }
 
      // Buscar docente por email
      const docente = await this.prisma.docente.findUnique({
        where: { email },
        include: { suscripcion: true },
      });
 
      if (!docente) {
        this.logger.warn(`Docente no encontrado para email: ${email}`);
        return;
      }
 
      const planInfo = PLAN_MAP[planMpId];
      if (!planInfo) {
        this.logger.warn(`Plan no reconocido: ${planMpId}`);
        return;
      }
 
      const estadoSuscripcion =
        estado === 'authorized' ? 'activa' :
        estado === 'paused'     ? 'pausada' :
        estado === 'cancelled'  ? 'cancelada' : 'inactiva';
 
      const fechaFin = planInfo.periodo === 'anual'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30  * 24 * 60 * 60 * 1000);
 
      if (docente.suscripcion) {
        // Actualizar suscripción existente
        await this.prisma.suscripcion.update({
          where: { docenteId: docente.id },
          data: {
            estado:                estadoSuscripcion,
            planId:                planInfo.planId,
            periodo:               planInfo.periodo,
            proveedor:             'mercadopago',
            externalSubscriptionId: preapprovalId,
            fechaFin,
            actualizadoEn:         new Date(),
          },
        });
      } else {
        // Crear suscripción nueva
        await this.prisma.suscripcion.create({
          data: {
            docenteId:              docente.id,
            planId:                 planInfo.planId,
            estado:                 estadoSuscripcion,
            proveedor:              'mercadopago',
            externalSubscriptionId: preapprovalId,
            periodo:                planInfo.periodo,
            fechaInicio:            new Date(),
            fechaFin,
            autoRenovacion:         true,
          },
        });
      }
 
      this.logger.log(`Suscripción actualizada para ${email}: ${estadoSuscripcion}`);
    } catch (err) {
      this.logger.error('Error procesando suscripción:', err);
    }
  }
}
 