import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuscripcionesService {

  constructor(private prisma: PrismaService) {}

  async obtenerSuscripcion(docenteId: number) {
    return this.prisma.suscripcion.findUnique({
      where: {
        docenteId: docenteId
      },
      include: {
        plan: true
      }
    });
  }

}