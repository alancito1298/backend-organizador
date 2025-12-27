import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { CursosService } from './cursos.service';
  import { CreateCursoDto } from './dto/create-curso.dto';
  import { UpdateCursoDto } from './dto/update-curso.dto';
  
  @Controller()
  export class CursosController {
    constructor(private readonly cursosService: CursosService) {}
  
    @Post('cursos')
    create(@Body() dto: CreateCursoDto) {
      return this.cursosService.create(dto);
    }
  
    @Get('cursos')
    findAll() {
      return this.cursosService.findAll();
    }
  
    @Get('cursos/:id')
    findOne(@Param('id') id: string) {
      return this.cursosService.findOne(Number(id));
    }
  
    @Get('docentes/:id/cursos')
    findByDocente(@Param('id') id: string) {
      return this.cursosService.findByDocente(Number(id));
    }
  
    @Put('cursos/:id')
    update(
      @Param('id') id: string,
      @Body() dto: UpdateCursoDto,
    ) {
      return this.cursosService.update(Number(id), dto);
    }
  
    @Delete('cursos/:id')
    remove(@Param('id') id: string) {
      return this.cursosService.remove(Number(id));
    }
  }
  