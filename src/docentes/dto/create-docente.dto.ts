import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class CreateDocenteDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;
  
  
  @IsStrongPassword()
  password: string;

  
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  proveedorAuth?: string;
}
