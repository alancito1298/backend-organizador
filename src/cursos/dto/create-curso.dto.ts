import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  escuela: string;

  @IsString()
  anio: string;

  @IsString()
  materia: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  orientacion?: string;
}
