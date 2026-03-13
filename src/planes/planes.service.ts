import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlanesService {

  constructor(private prisma: PrismaService) {}

  async obtenerPlanes() {
    return this.prisma.plan.findMany({
      where: {
        activo: true
      }
    });
  }

}