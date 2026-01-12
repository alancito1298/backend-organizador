import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAgendaDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
