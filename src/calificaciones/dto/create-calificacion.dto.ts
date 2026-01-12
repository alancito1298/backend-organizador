import { IsDateString, IsEnum, IsInt, IsNumber } from 'class-validator';
import { TipoEvaluacion } from '@prisma/client';

export class CreateCalificacionDto {
  @IsNumber()
  valor: number;

  @IsDateString()
  fecha: string;

  @IsInt()
  trimestre: number;

  @IsEnum(TipoEvaluacion)
  tipo: TipoEvaluacion;

  @IsInt()
  alumnoCursoId: number;
}
