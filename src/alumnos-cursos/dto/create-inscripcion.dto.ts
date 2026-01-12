import { IsInt } from 'class-validator';

export class CreateAlumnoCursoDto {
  @IsInt()
  alumnoId: number;

  @IsInt()
  cursoId: number;
}
