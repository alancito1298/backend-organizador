import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateDocenteDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  proveedorAuth?: string;
}
