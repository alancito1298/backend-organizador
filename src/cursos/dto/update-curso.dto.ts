import { IsOptional, IsString } from 'class-validator';

export class UpdateCursoDto {
  @IsOptional()
  @IsString()
  escuela?: string;

  @IsOptional()
  @IsString()
  anio?: string;

  @IsOptional()
  @IsString()
  materia?: string;
}
