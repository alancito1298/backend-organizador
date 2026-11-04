import { IsOptional, IsString, MaxLength } from 'class-validator';

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

  @IsOptional()
  @IsString()
  @MaxLength(80)
  orientacion?: string;
}
