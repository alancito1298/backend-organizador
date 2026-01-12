import { IsOptional, IsString } from 'class-validator';

export class CreateAlumnoDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsString()
  contacto?: string;
}
