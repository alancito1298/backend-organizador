import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlumnoCursoDto } from './dto/create-inscripcion.dto';

@Injectable()
export class AlumnosCursosService {
  constructor(private prisma: PrismaService) {}

  // INSCRIBIR (verificando pertenencia del curso)
  async create(dto: CreateAlumnoCursoDto, docenteId: number) {
    const curso = await this.prisma.curso.findFirst({
      where: { id: dto.cursoId, docenteId, existe: true },
    });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    return this.prisma.alumnoCurso.create({
      data: {
        alumnoId: dto.alumnoId,
        cursoId: dto.cursoId,
      },
    });
  }

  // ALUMNOS DE UN CURSO (verificando pertenencia del curso)
  async findByCurso(cursoId: number, docenteId: number) {
    const curso = await this.prisma.curso.findFirst({
      where: { id: cursoId, docenteId, existe: true },
    });
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    return this.prisma.alumnoCurso.findMany({
      where: { cursoId },
      include: {
        alumno: true,
      },
    });
  }

  // CURSOS DE UN ALUMNO (filtrado por docente)
  findByAlumno(alumnoId: number, docenteId: number) {
    return this.prisma.alumnoCurso.findMany({
      where: {
        alumnoId,
        curso: { docenteId, existe: true },
      },
      include: {
        curso: true,
      },
    });
  }

  // DESINSCRIBIR (verificando pertenencia del curso)
  async remove(id: number, docenteId: number) {
    const alumnoCurso = await this.prisma.alumnoCurso.findFirst({
      where: {
        id,
        curso: { docenteId, existe: true },
      },
    });
    if (!alumnoCurso) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    return this.prisma.alumnoCurso.delete({
      where: { id },
    });
  }
}
