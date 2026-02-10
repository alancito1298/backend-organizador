import { IsEnum, IsInt, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { TipoEvaluacion } from '@prisma/client';

export class UpdateCalificacionDto {
  @IsOptional()
  @IsNumber()
  valor?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsInt()
  trimestre?: number;

  @IsOptional()
  @IsEnum(TipoEvaluacion)
  tipo?: TipoEvaluacion;
}
