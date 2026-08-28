import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';

@Injectable()
export class AsistenciasService {
  constructor(private prisma: PrismaService) {}

  // Crear asistencia (verificando pertenencia de la inscripción al docente)
  async create(dto: CreateAsistenciaDto, docenteId: number) {
    const alumnoCurso = await this.prisma.alumnoCurso.findFirst({
      where: {
        id: dto.alumnoCursoId,
        curso: { docenteId, existe: true },
      },
    });
    if (!alumnoCurso) {
      throw new NotFoundException('Inscripción no encontrada o no autorizada');
    }

    return this.prisma.asistencia.create({
      data: {
        fecha: new Date(dto.fecha),
        estado: dto.estado,
        trimestre: dto.trimestre,
        alumnoCursoId: dto.alumnoCursoId,
      },
    });
  }

  // Asistencias por curso (verificando pertenencia del curso al docente)
  async findByCurso(
    cursoId: number,
    docenteId: number,
    trimestre?: number
  ) {
    const curso = await this.prisma.curso.findFirst({
      where: { id: cursoId, docenteId, existe: true },
    });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    return this.prisma.asistencia.findMany({
      where: {
        alumnoCurso: {
          cursoId,
        },
        ...(trimestre && {
          trimestre,
        }),
      },
      include: {
        alumnoCurso: {
          include: {
            alumno: true,
          },
        },
      },
      orderBy: {
        fecha: 'asc',
      },
    });
  }

  // Actualizar estado (verificando pertenencia)
  async update(id: number, dto: UpdateAsistenciaDto, docenteId: number) {
    const asistencia = await this.prisma.asistencia.findFirst({
      where: {
        id,
        alumnoCurso: {
          curso: { docenteId, existe: true },
        },
      },
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

  // Borrar (verificando pertenencia)
  async remove(id: number, docenteId: number) {
    const asistencia = await this.prisma.asistencia.findFirst({
      where: {
        id,
        alumnoCurso: {
          curso: { docenteId, existe: true },
        },
      },
    });

    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada');
    }

    return this.prisma.asistencia.delete({
      where: { id },
    });
  }
}
