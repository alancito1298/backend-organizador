import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Injectable()
export class CalificacionesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCalificacionDto) {
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

  findByAlumnoCurso(alumnoCursoId: number) {
    return this.prisma.calificacion.findMany({
      where: { alumnoCursoId },
      orderBy: { fecha: 'asc' },
    });
  }

  async update(id: number, dto: UpdateCalificacionDto) {
    const calificacion = await this.prisma.calificacion.findUnique({ where: { id } });
    if (!calificacion) throw new NotFoundException('Calificación no encontrada');

    return this.prisma.calificacion.update({
      where: { id },
      data: {
        ...dto,
        fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      },
    });
  }

  remove(id: number) {
    return this.prisma.calificacion.delete({ where: { id } });
  }
}
