import { IsDateString, IsString } from 'class-validator';

export class CreateAgendaDto {
  @IsDateString()
  fecha: string;

  @IsString()
  descripcion: string;
  
}