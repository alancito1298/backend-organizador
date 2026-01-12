import { IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';
import { TipoEvaluacion } from '@prisma/client';

export class UpdateCalificacionDto {
  @IsOptional()
  @IsNumber()
  valor?: number;

  @IsOptional()
  @IsInt()
  trimestre?: number;

  @IsOptional()
  @IsEnum(TipoEvaluacion)
  tipo?: TipoEvaluacion;
}
