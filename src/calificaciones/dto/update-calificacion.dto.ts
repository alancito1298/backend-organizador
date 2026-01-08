import { TipoEvaluacion } from '@prisma/client';

export class UpdateCalificacionDto {
  valor?: number;
  fecha?: string;
  trimestre?: number;
  tipo?: TipoEvaluacion;
}
