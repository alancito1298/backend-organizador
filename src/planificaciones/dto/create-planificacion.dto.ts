import { IsNotEmpty, IsOptional, IsString, IsUrl, IsDateString } from 'class-validator';

export class CreatePlanificacionDto {
  @IsString()
  @IsNotEmpty({ message: 'El tema es obligatorio' })
  tema: string;

  @IsUrl({ require_tld: false }, { message: 'El link debe ser una URL válida' })
  link: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe ser válida' })
  fecha?: string;
}
