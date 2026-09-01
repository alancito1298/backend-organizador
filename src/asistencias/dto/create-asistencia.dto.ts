import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { EstadoAsistencia } from '@prisma/client';

export class CreateAsistenciaDto {
  @IsDateString()
  fecha: string;

  @IsEnum(EstadoAsistencia)
  estado: EstadoAsistencia;

  @IsInt()
  alumnoCursoId: number;

  @IsOptional()
  @IsInt()
  trimestre?: number;
}
