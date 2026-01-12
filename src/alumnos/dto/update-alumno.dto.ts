import { IsOptional, IsString } from 'class-validator';

export class UpdateAlumnoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  contacto?: string;
}
