import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DiaSemana } from '@prisma/client';

export class UpdateHorarioDto {
    @IsOptional()
    @IsEnum(DiaSemana, {
    message: 'El día debe ser válido (Lunes a Viernes)',
  })
  dia: DiaSemana;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La hora es obligatoria' })
  hora?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
