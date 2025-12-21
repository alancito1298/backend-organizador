import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocentesService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    proveedorAuth?: string;
  }) {
    return this.prisma.docente.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
        proveedorAuth: data.proveedorAuth,
      },
    });
  }
}