import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DocentesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDocenteDto) {
    const docenteExistente = await this.prisma.docente.findUnique({
      where: { email: dto.email },
    });

    if (docenteExistente) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const resultado = await this.prisma.$transaction(async (tx) => {
      const docente = await tx.docente.create({
        data: {
          nombre:    dto.nombre,
          apellido:  dto.apellido,
          email:     dto.email,
          password:  hashedPassword,
          proveedorAuth: 'ninguno',
        },
      });

      await tx.suscripcion.create({
        data: {
          docenteId:        docente.id,
          planId:           1,
          estado:           'trial',
          proveedor:        'ninguno',  // ← campo obligatorio
          fechaInicio:      new Date(),
          fechaTrialInicio: new Date(),
          fechaTrialFin:    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          autoRenovacion:   false,
        },
      });

      return docente;
    });

    return resultado;
  }

  findAll() {
    return this.prisma.docente.findMany();
  }

  async findOne(id: number) {
    const docente = await this.prisma.docente.findUnique({
      where: { id },
    });

    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }

    return docente;
  }

  async update(id: number, dto: UpdateDocenteDto) {
    await this.findOne(id);

    return this.prisma.docente.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.docente.delete({
      where: { id },
    });
  }
}