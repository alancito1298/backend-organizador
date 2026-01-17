import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAlumnoCursoDto } from './dto/create-inscripcion.dto';

@Injectable()
export class AlumnosCursosService {
  constructor(private prisma: PrismaService) {}

  // INSCRIBIR
  create(dto: CreateAlumnoCursoDto) {
    return this.prisma.alumnoCurso.create({
      data: {
        alumnoId: dto.alumnoId,
        cursoId: dto.cursoId,
      },
    });
  }

  // ALUMNOS DE UN CURSO
  findByCurso(cursoId: number) {
    return this.prisma.alumnoCurso.findMany({
      where: { cursoId },
      include: {
        alumno: true,
      },
    });
  }

  // CURSOS DE UN ALUMNO
  findByAlumno(alumnoId: number) {
    return this.prisma.alumnoCurso.findMany({
      where: { alumnoId },
      include: {
        curso: true,
      },
    });
  }

  // DESINSCRIBIR
  remove(id: number) {
    return this.prisma.alumnoCurso.delete({
      where: { id },
    });
  }
}
