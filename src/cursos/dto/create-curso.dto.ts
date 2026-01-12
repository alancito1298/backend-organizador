import { IsInt, IsString } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  escuela: string;

  @IsString()
  anio: string;

  @IsString()
  materia: string;

  @IsInt()
  docenteId: number;
}
