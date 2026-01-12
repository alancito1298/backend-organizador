import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateAgendaDto {
  @IsDateString()
  fecha: string;

  @IsString()
  descripcion: string;

  @IsInt()
  docenteId: number;
}
