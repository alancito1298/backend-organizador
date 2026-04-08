import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

@Injectable()
export class SuscripcionesService {

  private readonly logger = new Logger(SuscripcionesService.name);
  private mp: MercadoPagoConfig;

  constructor(private prisma: PrismaService) {
    this.mp = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
  }

  async obtenerSuscripcion(docenteId: number) {
    return this.prisma.suscripcion.findUnique({
      where: { docenteId },
      include: { plan: true },
    });
  }

  async crearCheckout(planMpId: string, docenteId: number) {
    const docente = await this.prisma.docente.findUnique({
      where: { id: docenteId },
    });

    if (!docente) throw new Error('Docente no encontrado');

    const client = new PreApproval(this.mp);

    const preapproval = await client.create({
      body: {
        preapproval_plan_id: planMpId,
        payer_email:         docente.email,
        external_reference:  String(docenteId),
        back_url:            `${process.env.FRONTEND_URL ?? 'https://organizador-rho.vercel.app'}/pago-exitoso`,
        status:              'pending',
        free_trial: {
          frequency:      30,
          frequency_type: 'days',
        },
      } as any,
    });

    this.logger.log(`Checkout creado para docente ${docenteId}: ${preapproval.id}`);

    return {
      checkoutUrl: (preapproval as any).init_point,
      id:          preapproval.id,
    };
  }

}