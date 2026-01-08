import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly service: CalificacionesService) {}

  @Post()
  create(@Body() dto: CreateCalificacionDto) {
    return this.service.create(dto);
  }

  @Get('inscripcion/:id')
  findByAlumnoCurso(@Param('id') id: string) {
    return this.service.findByAlumnoCurso(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCalificacionDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
  @Get('ping')
  ping() {
    return 'calificaciones ok';
  }
  
}
