import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBibliografiaDto {
  @IsString()
  @IsNotEmpty({ message: 'El tema es obligatorio' })
  tema: string;

  @IsUrl({}, { message: 'El link debe ser una URL válida' })
  link: string;
}
