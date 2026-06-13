import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto'
import  {UpdateAlumnoDto} from './dto/update-alumno.dto'

@Injectable()

export class AlumnosService {
  constructor (private prisma: PrismaService) {}

  //crea alumno
  create(dto: CreateAlumnoDto) {
    return this.prisma.alumno.create({
      data: dto,
    })
  }

  findAll () {
    return this.prisma.alumno.findMany()
  }

  // lee uno
  async findOne (id: number) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
    })
    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado')
    }
    return alumno
  }


  async getPerfilAlumno(
    alumnoCursoId: number,
  ) {
  
    const alumnoCurso =
      await this.prisma.alumnoCurso.findUnique({
        where: {
          id: alumnoCursoId,
        },
  
        include: {
          alumno: true,
          curso: true,
          asistencias: true,
          notas: true,
        },
      });
  
    if (!alumnoCurso) {
      throw new NotFoundException(
        'Alumno no encontrado',
      );
    }
  
    const asistencias =
      alumnoCurso.asistencias;
  
    const notas =
      alumnoCurso.notas;
  
    // ======================
    // ASISTENCIAS
    // ======================
  
    const presentesBuenConcepto =
      asistencias.filter(
        (a) =>
          a.estado ===
          'presente_buen_concepto'
      ).length;
  
    const presentesMalConcepto =
      asistencias.filter(
        (a) =>
          a.estado ===
          'presente_mal_concepto'
      ).length;
  
    const ausentes =
      asistencias.filter(
        (a) =>
          a.estado ===
          'ausente'
      ).length;
  
    const justificadas =
      asistencias.filter(
        (a) =>
          a.estado ===
          'justificada'
      ).length;
  
    const totalAsistencias =
      asistencias.length;
  
    const totalPresentes =
      presentesBuenConcepto +
      presentesMalConcepto;
  
    const totalFaltas =
      ausentes +
      justificadas;
  
    const porcentajeAsistencia =
      totalAsistencias > 0
        ? Number(
            (
              (
                totalPresentes +
                justificadas
              ) *
              100 /
              totalAsistencias
            ).toFixed(1)
          )
        : 0;
  
    const porcentajeBuenConcepto =
      totalPresentes > 0
        ? Number(
            (
              presentesBuenConcepto *
              100 /
              totalPresentes
            ).toFixed(1)
          )
        : 0;
  
    const porcentajeMalConcepto =
      totalPresentes > 0
        ? Number(
            (
              presentesMalConcepto *
              100 /
              totalPresentes
            ).toFixed(1)
          )
        : 0;
  
    const porcentajeJustificadas =
      totalFaltas > 0
        ? Number(
            (
              justificadas *
              100 /
              totalFaltas
            ).toFixed(1)
          )
        : 0;
  
    // ======================
    // CALIFICACIONES
    // ======================
  
    const promedioGeneral =
      notas.length > 0
        ? Number(
            (
              notas.reduce(
                (acc, nota) =>
                  acc + nota.valor,
                0
              ) /
              notas.length
            ).toFixed(2)
          )
        : 0;
  
    const notasPrimer =
      notas.filter(
        (n) =>
          n.trimestre === 1
      );
  
    const notasSegundo =
      notas.filter(
        (n) =>
          n.trimestre === 2
      );
  
    const notasTercero =
      notas.filter(
        (n) =>
          n.trimestre === 3
      );
  
    const promedioPrimerTrimestre =
      notasPrimer.length > 0
        ? Number(
            (
              notasPrimer.reduce(
                (acc, nota) =>
                  acc + nota.valor,
                0
              ) /
              notasPrimer.length
            ).toFixed(2)
          )
        : 0;
  
    const promedioSegundoTrimestre =
      notasSegundo.length > 0
        ? Number(
            (
              notasSegundo.reduce(
                (acc, nota) =>
                  acc + nota.valor,
                0
              ) /
              notasSegundo.length
            ).toFixed(2)
          )
        : 0;
  
    const promedioTercerTrimestre =
      notasTercero.length > 0
        ? Number(
            (
              notasTercero.reduce(
                (acc, nota) =>
                  acc + nota.valor,
                0
              ) /
              notasTercero.length
            ).toFixed(2)
          )
        : 0;
  
const trabajosPracticos =
  notas.filter(
    n =>
      n.tipo ===
      'trabajo_practico'
  ).length;

const examenes =
  notas.filter(
    n =>
      n.tipo ===
      'Examen'
  ).length;

const finales =
  notas.filter(
    n =>
      n.tipo ===
      'final'
  ).length;
    

  
    // ======================
    // RESULTADO
    // ======================
  
    return {
  
      alumno:
        alumnoCurso.alumno,
  
      curso:
        alumnoCurso.curso,
  
      estadisticas: {
  
        presentesBuenConcepto,
  
        presentesMalConcepto,
  
        ausentes,
  
        justificadas,
  
        totalAsistencias,
  
        totalPresentes,
  
        totalFaltas,
  
        porcentajeAsistencia,
  
        porcentajeBuenConcepto,
  
        porcentajeMalConcepto,
  
        porcentajeJustificadas,
  
      },
  
      promedios: {
  
        general:
          promedioGeneral,
  
        primerTrimestre:
          promedioPrimerTrimestre,
  
        segundoTrimestre:
          promedioSegundoTrimestre,
  
        tercerTrimestre:
          promedioTercerTrimestre,
  
      },
      cantidadesNotas: {

        trabajosPracticos,
    
        examenes,
    
        finales,
    
      },

      notas,
  
      asistencias,
  
    };
  
  }


// actualizar
async update(id: number, dto: UpdateAlumnoDto) {
    await this.findOne(id);

    return this.prisma.alumno.update({
      where: { id },
      data: dto,
    });
  }

  // borrar
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.alumno.delete({
      where: { id },
    });
  }
}