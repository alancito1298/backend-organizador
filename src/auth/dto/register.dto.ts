import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  provincia?: string;

  @IsString()
  @IsOptional()
  localidad?: string;

  @IsString()
  @IsOptional()
  fechaNacimiento?: string;
}