import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import * as bcrypt from 'bcrypt';

const DOCENTE_SELECT_SAFE = {
  id: true,
  nombre: true,
  apellido: true,
  email: true,
  telefono: true,
  proveedorAuth: true,
  creadoEn: true,
  existe: true,
  provincia: true,
  localidad: true,
  fechaNacimiento: true,
};

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
        select: DOCENTE_SELECT_SAFE,
      });

      await tx.suscripcion.create({
        data: {
          docenteId:        docente.id,
          planId:           1,
          estado:           'trial',
          proveedor:        'ninguno',
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

  findAll(docenteId: number) {
    return this.prisma.docente.findMany({
      where: { id: docenteId },
      select: DOCENTE_SELECT_SAFE,
    });
  }

  async findOne(id: number, docenteId?: number) {
    const targetId = docenteId || id;
    const docente = await this.prisma.docente.findUnique({
      where: { id: targetId },
      select: DOCENTE_SELECT_SAFE,
    });

    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }

    return docente;
  }

  async update(id: number, dto: UpdateDocenteDto, docenteId?: number) {
    const targetId = docenteId || id;
    await this.findOne(targetId);

    return this.prisma.docente.update({
      where: { id: targetId },
      data: dto,
      select: DOCENTE_SELECT_SAFE,
    });
  }

  async remove(id: number, docenteId?: number) {
    const targetId = docenteId || id;
    await this.findOne(targetId);

    return this.prisma.docente.delete({
      where: { id: targetId },
      select: DOCENTE_SELECT_SAFE,
    });
  }
}