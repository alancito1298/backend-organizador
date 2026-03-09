import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePlanificacionDto } from './dto/create-planificacion.dto';

@Injectable()
export class PlanificacionesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear planificación (solo si el curso es del docente)
   */
  async create(
    dto: CreatePlanificacionDto,
    cursoId: number,
    docenteId: number,
  ) {
    const curso = await this.prisma.curso.findFirst({
      where: { id: cursoId, docenteId },
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    return this.prisma.planificacion.create({
      data: {
        tema: dto.tema,
        link: dto.link,
        fecha: dto.fecha ? new Date(dto.fecha) : null,
        cursoId,
      },
    });
  }

  /**
   * Listar planificaciones de un curso (si es del docente)
   */
  async findByCurso(cursoId: number, docenteId: number) {
    const curso = await this.prisma.curso.findFirst({
      where: { id: cursoId, docenteId },
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    return this.prisma.planificacion.findMany({
      where: { cursoId },
      orderBy: { fecha: 'asc' },
    });
  }
  async findByDocente(docenteId: number) {
    return this.prisma.planificacion.findMany({
      where: {
        curso: { docenteId },
      },
      include: {
        curso: {
          select: { id: true, materia: true, anio: true, escuela: true },
        },
      },
      orderBy: { fecha: 'asc' },
    });
  }
}