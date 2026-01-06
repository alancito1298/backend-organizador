import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';

@Injectable()
export class AsistenciasService {
  constructor(private prisma: PrismaService) {}

  // Crear asistencia
  create(dto: CreateAsistenciaDto) {
    return this.prisma.asistencia.create({
      data: {
        fecha: new Date(dto.fecha),
        estado: dto.estado,
        alumnoCursoId: dto.alumnoCursoId,
      },
    });
  }

  // Asistencias por curso (vía inscripción)
  findByCurso(cursoId: number) {
    return this.prisma.asistencia.findMany({
      where: {
        alumnoCurso: {
          cursoId: cursoId,
        },
      },
      include: {
        alumnoCurso: {
          include: {
            alumno: true,
          },
        },
      },
      orderBy: { fecha: 'asc' },
    });
  }

  // Actualizar estado
  async update(id: number, dto: UpdateAsistenciaDto) {
    const asistencia = await this.prisma.asistencia.findUnique({
      where: { id },
    });

    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }

    return this.prisma.asistencia.update({
      where: { id },
      data: {
        estado: dto.estado,
      },
    });
  }

  // Borrar
  remove(id: number) {
    return this.prisma.asistencia.delete({
      where: { id },
    });
  }
}
