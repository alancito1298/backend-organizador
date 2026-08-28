import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';

@Controller('calificaciones')
export class CalificacionesController {
  constructor(private readonly service: CalificacionesService) {}

  @Post()
  create(@Body() dto: CreateCalificacionDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Get('inscripcion/:id')
  findByAlumnoCurso(@Param('id') id: string, @Req() req: any) {
    return this.service.findByAlumnoCurso(Number(id), req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCalificacionDto, @Req() req: any) {
    return this.service.update(Number(id), dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(Number(id), req.user.id);
  }

  @Get('ping')
  ping() {
    return 'calificaciones ok';
  }
  
  @Get('curso/:cursoId')
  findByCurso(@Param('cursoId') cursoId: string, @Req() req: any) {
    return this.service.findByCurso(Number(cursoId), req.user.id);
  }
}


