import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagosService {

  constructor(private prisma: PrismaService) {}

  async crearPago(suscripcionId: number, monto: number) {
    return this.prisma.pago.create({
      data: {
        monto,
        estado: 'pendiente',
        metodo: 'manual',
        suscripcionId,
      }
    });
  }

}