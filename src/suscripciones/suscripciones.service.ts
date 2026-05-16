import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

@Injectable()
export class SuscripcionesService {
  private mp: MercadoPagoConfig;

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

    return {
      ...suscripcion,
      diasRestantes,
    };
  }

  async crearCheckout(planMpId: string, docenteId: number) {
    const docente = await this.prisma.docente.findUnique({
      where: { id: docenteId },
    });
  
    if (!docente) throw new Error('Docente no encontrado');
  
    const checkoutUrl = `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${planMpId}&external_reference=${docenteId}&payer_email=${encodeURIComponent(docente.email)}`;
  
    return { checkoutUrl };
  }
}