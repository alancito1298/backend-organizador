import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { AlumnosService } from './alumnos.service';
  import { CreateAlumnoDto } from './dto/create-alumno.dto';
  import { UpdateAlumnoDto } from './dto/update-alumno.dto';
  
  @Controller('alumnos')
  export class AlumnosController {
    constructor(private readonly alumnosService: AlumnosService) {}
  
    @Post()
    create(@Body() dto: CreateAlumnoDto) {
      return this.alumnosService.create(dto);
    }
  
    @Get()
    findAll() {
      return this.alumnosService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.alumnosService.findOne(Number(id));
    }
  
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() dto: UpdateAlumnoDto,
    ) {
      return this.alumnosService.update(Number(id), dto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.alumnosService.remove(Number(id));
    }
  }