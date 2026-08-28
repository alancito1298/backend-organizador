import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  async crearPago(suscripcionId: number, monto: number, docenteId: number) {
    const suscripcion = await this.prisma.suscripcion.findFirst({
      where: {
        id: suscripcionId,
        docenteId,
      },
    });

    if (!suscripcion) {
      throw new NotFoundException('Suscripción no encontrada o no autorizada');
    }

    return this.prisma.pago.create({
      data: {
        monto,
        estado: 'pendiente',
        metodo: 'manual',
        suscripcionId,
      },
    });
  }
}