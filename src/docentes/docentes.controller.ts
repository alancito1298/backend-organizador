import { Body, Controller, Post } from '@nestjs/common';
import { DocentesService } from './docentes.service';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Post()
  create(@Body() body: any) {
    return this.docentesService.create(body);
  }
}