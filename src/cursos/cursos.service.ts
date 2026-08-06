import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREAR CURSO
   * El docenteId viene del token (NO del frontend)
   */
   async create(dto: CreateCursoDto, docenteId: number) {

    // 1️⃣ buscar suscripción del docente
    const suscripcion = await this.prisma.suscripcion.findUnique({
      where: { docenteId },
      include: {
        plan: true
      }
    });
  
    if (!suscripcion) {
      throw new NotFoundException('El docente no tiene suscripción');
    }
  
    // 2️⃣ contar cursos actuales
    const cursosActuales = await this.prisma.curso.count({
      where: {
        docenteId,
        existe: true
      }
    });
  
    // 3️⃣ verificar límite del plan
    if (cursosActuales >= suscripcion.plan.maxcursos) {
      throw new ForbiddenException(
        `Has alcanzado el límite de cursos de tu plan (${suscripcion.plan.maxcursos})`
      );
    }
  
    // 4️⃣ crear curso
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
