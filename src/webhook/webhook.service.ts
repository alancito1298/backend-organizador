import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const PLAN_MAP: Record<string, { planId: number; periodo: string }> = {
  'd9333165a97b4e60a9b87f27b13c6676': { planId: 1, periodo: 'mensual' },
  'f597ba1d700440b7b40139c8060f78dc': { planId: 1, periodo: 'anual'   },
  '00418792d857442da35980be23928b2a': { planId: 2, periodo: 'mensual' },
  '055a8d3ffb0f403eb1376ed38adde4ba': { planId: 2, periodo: 'anual'   },
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
      const client      = new PreApproval(this.mp);
      const preapproval = await client.get({ id: preapprovalId }) as any;

      this.logger.log(`PreApproval status: ${preapproval.status}`);
      this.logger.log(`external_reference: ${preapproval.external_reference}`);

      const externalRef = preapproval.external_reference;
      const planMpId    = preapproval.preapproval_plan_id;
      const estado      = preapproval.status;

      let docenteId: number | null = null;

      // Buscar por código único en SuscripcionPendiente
      if (externalRef) {
        const pendiente = await this.prisma.suscripcionPendiente.findUnique({
          where: { codigo: externalRef },
        });

        if (pendiente) {
          docenteId = pendiente.docenteId;
          this.logger.log(`Docente encontrado por código: ${docenteId}`);

          // Borrar el registro pendiente
          await this.prisma.suscripcionPendiente.delete({
            where: { codigo: externalRef },
          });
        }
      }

      if (!docenteId) {
        this.logger.warn(`No se encontró docente para external_reference: ${externalRef}`);
        return;
      }

      const planInfo = PLAN_MAP[planMpId];
      if (!planInfo) {
        this.logger.warn(`Plan no reconocido: ${planMpId}`);
        return;
      }

      const estadoSuscripcion =
        estado === 'authorized' ? 'activa'    :
        estado === 'paused'     ? 'pausada'   :
        estado === 'cancelled'  ? 'cancelada' : 'inactiva';

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
            estado:                 estadoSuscripcion,
            planId:                 planInfo.planId,
            periodo:                planInfo.periodo,
            proveedor:              'mercadopago',
            externalSubscriptionId: preapprovalId,
            fechaFin,
            actualizadoEn:          new Date(),
          },
        });
      } else {
        await this.prisma.suscripcion.create({
          data: {
            docenteId,
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

      this.logger.log(`Suscripción actualizada para docente ${docenteId}: ${estadoSuscripcion}`);
    } catch (err) {
      this.logger.error('Error procesando suscripción:', err);
    }
  }
}