import { PartialType } from '@nestjs/mapped-types';
import { CreateBibliografiaDto } from './create-bibliografia.dto';

export class UpdateBibliografiaDto extends PartialType(CreateBibliografiaDto) {}
