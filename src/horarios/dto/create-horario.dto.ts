import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DiaSemana } from '@prisma/client';

export class CreateHorarioDto {
  @IsEnum(DiaSemana, {
    message: 'El día debe ser válido (Lunes a Viernes)',
  })
  dia: DiaSemana;

  @IsString()
  @IsNotEmpty({ message: 'La hora es obligatoria' })
  hora: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
