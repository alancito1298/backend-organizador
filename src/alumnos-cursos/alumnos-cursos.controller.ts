import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AlumnosCursosService } from './alumnos-cursos.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';

@Controller('inscripciones')
export class AlumnosCursosController {
  constructor(private readonly service: AlumnosCursosService) {}

  @Post()
  create(@Body() dto: CreateInscripcionDto) {
    return this.service.create(dto);
  }

  @Get('curso/:cursoId')
  findByCurso(@Param('cursoId') cursoId: string) {
    return this.service.findByCurso(Number(cursoId));
  }

  @Get('alumno/:alumnoId')
  findByAlumno(@Param('alumnoId') alumnoId: string) {
    return this.service.findByAlumno(Number(alumnoId));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
