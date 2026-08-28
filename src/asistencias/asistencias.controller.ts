import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Query,
  } from '@nestjs/common';
  import { AsistenciasService } from './asistencias.service';
  import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
  import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
  
  @Controller('asistencias')
  export class AsistenciasController {
    constructor(private readonly asistenciasService: AsistenciasService) {}
  
    @Post()
    create(@Body() dto: CreateAsistenciaDto, @Req() req: any) {
      return this.asistenciasService.create(dto, req.user.id);
    }
  
    @Get('curso/:id')
    findByCurso(
      @Param('id')
      cursoId: string,
      @Req() req: any,
      @Query('trimestre')
      trimestre?: string,
    ) {
      return this.asistenciasService
        .findByCurso(
          Number(cursoId),
          req.user.id,
          trimestre
            ? Number(trimestre)
            : undefined
        );
    }
  
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() dto: UpdateAsistenciaDto,
      @Req() req: any,
    ) {
      return this.asistenciasService.update(Number(id), dto, req.user.id);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
      return this.asistenciasService.remove(Number(id), req.user.id);
    }
  }
  