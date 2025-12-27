import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  // CREATE
  create(dto: CreateCursoDto) {
    return this.prisma.curso.create({
      data: {
        escuela: dto.escuela,
        anio: dto.anio,
        materia: dto.materia,
        docente: {
          connect: { id: dto.docenteId },
        },
      },
    });
  }

  // READ ALL
  findAll() {
    return this.prisma.curso.findMany({
      include: {
        docente: true,
      },
    });
  }

  // READ ONE
  async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        docente: true,
      },
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    return curso;
  }

  // READ BY DOCENTE
  findByDocente(docenteId: number) {
    return this.prisma.curso.findMany({
      where: { docenteId },
    });
  }

  // UPDATE
  async update(id: number, dto: UpdateCursoDto) {
    await this.findOne(id);

    return this.prisma.curso.update({
      where: { id },
      data: dto,
    });
  }

  // DELETE
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.curso.delete({
      where: { id },
    });
  }
}

