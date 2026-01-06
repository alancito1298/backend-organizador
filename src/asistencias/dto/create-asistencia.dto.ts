
import { EstadoAsistencia } from '@prisma/client';

export class CreateAsistenciaDto {
  fecha: string;
  estado: EstadoAsistencia;
  alumnoCursoId: number;
}
