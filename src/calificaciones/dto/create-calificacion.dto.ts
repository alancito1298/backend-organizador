import { TipoEvaluacion } from '@prisma/client';

export class CreateCalificacionDto {
  valor: number;
  fecha: string;
  trimestre: number;
  tipo: TipoEvaluacion;
  alumnoCursoId: number;
}
