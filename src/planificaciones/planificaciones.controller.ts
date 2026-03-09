import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Req,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
  import { PlanificacionesService } from './planificaciones.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { CreatePlanificacionDto } from './dto/create-planificacion.dto';
  
  
  @UseGuards(JwtAuthGuard)
  @Controller('planificaciones')
  export class PlanificacionesController {
    constructor(
      private readonly planificacionesService: PlanificacionesService,
    ) {}
  
    @Post(':cursoId')
    create(
      @Param('cursoId', ParseIntPipe) cursoId: number,
      @Body() dto: CreatePlanificacionDto,
      @Req() req: any,
    ) {
      return this.planificacionesService.create(
        dto,
        cursoId,
        req.user.id,
      );
    }
  
    @Get(':cursoId')
    findByCurso(
      @Param('cursoId', ParseIntPipe) cursoId: number,
      @Req() req: any,
    ) {
      return this.planificacionesService.findByCurso(
        cursoId,
        req.user.id,
      );
    }
    @Get()
    findByDocente(@Req() req: any) {
      return this.planificacionesService.findByDocente(req.user.id);
    } 
  }
  