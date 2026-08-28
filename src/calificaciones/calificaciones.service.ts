import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Injectable()
export class CalificacionesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCalificacionDto, docenteId: number) {
    const alumnoCurso = await this.prisma.alumnoCurso.findFirst({
      where: {
        id: dto.alumnoCursoId,
        curso: { docenteId, existe: true },
      },
    });
    if (!alumnoCurso) {
      throw new NotFoundException('Inscripción no encontrada o no autorizada');
    }

    return this.prisma.calificacion.create({
      data: {
        valor: dto.valor,
        fecha: new Date(dto.fecha),
        trimestre: dto.trimestre,
        tipo: dto.tipo,
        alumnoCursoId: dto.alumnoCursoId,
      },
    });
  }

  async findByAlumnoCurso(alumnoCursoId: number, docenteId: number) {
    const alumnoCurso = await this.prisma.alumnoCurso.findFirst({
      where: {
        id: alumnoCursoId,
        curso: { docenteId, existe: true },
      },
    });
    if (!alumnoCurso) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    return this.prisma.calificacion.findMany({
      where: { alumnoCursoId },
      orderBy: { fecha: 'asc' },
    });
  }

  async update(id: number, dto: UpdateCalificacionDto, docenteId: number) {
    const calificacion = await this.prisma.calificacion.findFirst({
      where: {
        id,
        alumnoCurso: {
          curso: { docenteId, existe: true },
        },
      },
    });
    if (!calificacion) throw new NotFoundException('Calificación no encontrada');

    return this.prisma.calificacion.update({
      where: { id },
      data: {
        ...dto,
        fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      },
    });
  }

  async remove(id: number, docenteId: number) {
    const calificacion = await this.prisma.calificacion.findFirst({
      where: {
        id,
        alumnoCurso: {
          curso: { docenteId, existe: true },
        },
      },
    });
    if (!calificacion) throw new NotFoundException('Calificación no encontrada');

    return this.prisma.calificacion.delete({ where: { id } });
  }

  async findByCurso(cursoId: number, docenteId: number) {
    const curso = await this.prisma.curso.findFirst({
      where: { id: cursoId, docenteId, existe: true },
    });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    return this.prisma.calificacion.findMany({
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
      orderBy: {
        fecha: 'asc',
      },
    });
  }
}
