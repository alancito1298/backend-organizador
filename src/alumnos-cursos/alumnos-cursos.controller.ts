import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { AlumnosCursosService } from './alumnos-cursos.service';
import { CreateAlumnoCursoDto } from './dto/create-inscripcion.dto';

@Controller('inscripciones')
export class AlumnosCursosController {
  constructor(private readonly service: AlumnosCursosService) {}

  @Post()
  create(@Body() dto: CreateAlumnoCursoDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get('curso/:cursoId')
  findByCurso(@Param('cursoId') cursoId: string, @Req() req: any) {
    return this.service.findByCurso(Number(cursoId), req.user.id);
  }

  @Get('alumno/:alumnoId')
  findByAlumno(@Param('alumnoId') alumnoId: string, @Req() req: any) {
    return this.service.findByAlumno(Number(alumnoId), req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(Number(id), req.user.id);
  }
}
