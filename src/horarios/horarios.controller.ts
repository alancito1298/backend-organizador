import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    ParseIntPipe,
  } from '@nestjs/common';
  import { HorariosService } from './horarios.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { CreateHorarioDto } from './dto/create-horario.dto';
  
  @UseGuards(JwtAuthGuard)
  @Controller('horarios')
  export class HorariosController {
    constructor(private readonly horariosService: HorariosService) {}
  
    @Post()
    create(@Body() dto: CreateHorarioDto, @Req() req: any) {
      return this.horariosService.create(dto, req.user.id);
    }
  
    @Get()
    findAll(@Req() req: any) {
      return this.horariosService.findByDocente(req.user.id);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
      return this.horariosService.remove(id, req.user.id);
    }
  }
  