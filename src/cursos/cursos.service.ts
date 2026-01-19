import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREAR CURSO
   * El docenteId viene del token (NO del frontend)
   */
  create(dto: CreateCursoDto, docenteId: number) {
    return this.prisma.curso.create({
      data: {
        escuela: dto.escuela,
        anio: dto.anio,
        materia: dto.materia,
        docenteId,
      },
    });
  }

  /**
   * TRAER TODOS LOS CURSOS DEL DOCENTE LOGUEADO
   */
  findAllByDocente(docenteId: number) {
    return this.prisma.curso.findMany({
      where: {
        docenteId,
        existe: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  /**
   * TRAER UN CURSO ESPECÍFICO (Y VERIFICAR QUE SEA DEL DOCENTE)
   */
  async findOneByDocente(id: number, docenteId: number) {
    const curso = await this.prisma.curso.findFirst({
      where: {
        id,
        docenteId,
        existe: true,
      },
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    return curso;
  }

  /**
   * ACTUALIZAR CURSO (SOLO SI ES DEL DOCENTE)
   */
  async update(
    id: number,
    dto: UpdateCursoDto,
    docenteId: number,
  ) {
    // Verificamos propiedad
    await this.findOneByDocente(id, docenteId);

    return this.prisma.curso.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * ELIMINAR CURSO (SOFT DELETE)
   */
  async remove(id: number, docenteId: number) {
    await this.findOneByDocente(id, docenteId);

    return this.prisma.curso.update({
      where: { id },
      data: {
        existe: false,
      },
    });
  }
}
