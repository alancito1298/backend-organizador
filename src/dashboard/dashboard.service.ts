import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()
export class DashboardService {

  constructor(
    private prisma: PrismaService
  ) {}

  // ====================================
  // RESUMEN DOCENTE
  // ====================================
  async resumen(
    docenteId: number
  ) {

    // DOCENTE
    const docente =
      await this.prisma.docente.findUnique({
        where: {
          id: docenteId,
        },
      });

    // CURSOS
    const totalCursos =
      await this.prisma.curso.count({
        where: {
          docenteId,
        },
      });

    // ALUMNOS
    const totalAlumnos =
      await this.prisma.alumnoCurso.count({
        where: {
          curso: {
            docenteId,
          },
        },
      });

    // ASISTENCIAS
    const totalAsistencias =
      await this.prisma.asistencia.count({
        where: {
          alumnoCurso: {
            curso: {
              docenteId,
            },
          },
        },
      });

    // CALIFICACIONES
    const totalCalificaciones =
      await this.prisma.calificacion.count({
        where: {
          alumnoCurso: {
            curso: {
              docenteId,
            },
          },
        },
      });

    // HORARIOS
    const totalHorarios =
      await this.prisma.horario.count({
        where: {
          docenteId,
        },
      });

    // ⚠️ PLANIFICACIONES
    // tu modelo NO tiene docenteId directo
    // así que temporalmente lo dejamos en 0

    const totalPlanificaciones = 0;

    // DÍAS USANDO SISTEMA
    const diasUsandoSistema =
      docente?.creadoEn
        ? Math.floor(
            (
              Date.now() -
              new Date(
                docente.creadoEn
              ).getTime()
            ) /
              (
                1000 *
                60 *
                60 *
                24
              )
          )
        : 0;

    return {

      totalCursos,

      totalAlumnos,

      totalAsistencias,

      totalCalificaciones,

      totalHorarios,

      totalPlanificaciones,

      diasUsandoSistema,

    };

  }

  // ====================================
  // PERFIL ALUMNO
  // ====================================
  async perfilAlumno(
    alumnoId: number,
    docenteId: number,
  ) {

    // ALUMNO
    const alumno =
      await this.prisma.alumno.findUnique({

        where: {
          id: alumnoId,
        },

      });

    if (!alumno) {

      throw new NotFoundException(
        'Alumno no encontrado'
      );

    }

    // INSCRIPCIONES
    const inscripciones =
      await this.prisma.alumnoCurso.findMany({

        where: {
          alumnoId,
          curso: {
            docenteId,
          },
        },

        include: {

          curso: true,

          asistencias: true,

        },

      });

    // CALIFICACIONES
    const calificaciones =
      await this.prisma.calificacion.findMany({

        where: {
          alumnoCurso: {
            alumnoId,
            curso: {
              docenteId,
            },
          },
        },

      });

    // VALIDAR PERTENECE
    if (
      inscripciones.length === 0
    ) {

      throw new NotFoundException(
        'Alumno no encontrado'
      );

    }

    // ASISTENCIAS
    let presentes = 0;
    let ausentes = 0;

    for (
      const inscripcion of
      inscripciones
    ) {

      for (
        const asistencia of
        inscripcion.asistencias
      ) {

        if (
          asistencia.estado ===
            'presente_buen_concepto' ||
          asistencia.estado ===
            'presente_mal_concepto'
        ) {

          presentes++;

        }

        if (
          asistencia.estado ===
          'ausente'
        ) {

          ausentes++;

        }

      }

    }

    // PROMEDIO
    let sumaNotas = 0;

    for (
      const nota of
      calificaciones
    ) {

      sumaNotas += nota.valor;

    }

    const promedio =
      calificaciones.length > 0
        ? Number(
            (
              sumaNotas /
              calificaciones.length
            ).toFixed(2)
          )
        : 0;

    // %
    const porcentajeAsistencia =
      presentes + ausentes > 0
        ? Math.round(
            (
              presentes /
              (
                presentes +
                ausentes
              )
            ) * 100
          )
        : 0;

    return {

      alumno: {

        id: alumno.id,

        nombre:
          alumno.nombre,

        apellido:
          alumno.apellido,

        dni:
          alumno.dni,

        contacto:
          alumno.contacto,

      },

      cursos:
        inscripciones.map(
          (i) => ({
            id: i.curso.id,
            materia:
              i.curso.materia,
            escuela:
              i.curso.escuela,
            anio:
              i.curso.anio,
          })
        ),

      asistencias:
        inscripciones.flatMap(
          (i) =>
            i.asistencias
        ),

      calificaciones,

      estadisticas: {

        presentes,

        ausentes,

        promedio,

        porcentajeAsistencia,

      },

    };

  }

}