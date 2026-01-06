import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { AsistenciasService } from './asistencias.service';
  import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
  import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
  
  @Controller('asistencias')
  export class AsistenciasController {
    constructor(private readonly asistenciasService: AsistenciasService) {}
  
    @Post()
    create(@Body() dto: CreateAsistenciaDto) {
      return this.asistenciasService.create(dto);
    }
  
    @Get('curso/:cursoId')
    findByCurso(@Param('cursoId') cursoId: string) {
      return this.asistenciasService.findByCurso(Number(cursoId));
    }
  
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() dto: UpdateAsistenciaDto,
    ) {
      return this.asistenciasService.update(Number(id), dto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.asistenciasService.remove(Number(id));
    }
  }
  