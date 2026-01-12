import { IsEnum, IsOptional } from 'class-validator';
import { EstadoAsistencia } from '@prisma/client';

export class UpdateAsistenciaDto {
  @IsOptional()
  @IsEnum(EstadoAsistencia)
  estado?: EstadoAsistencia;
}
