import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
  } from '@nestjs/common';
  import { AlumnosService } from './alumnos.service';
  import { CreateAlumnoDto } from './dto/create-alumno.dto';
  import { UpdateAlumnoDto } from './dto/update-alumno.dto';
  
  @Controller('alumnos')
export class AlumnosController {
  constructor(
    private readonly alumnosService: AlumnosService,
  ) {}

  @Post()
  create(@Body() dto: CreateAlumnoDto) {
    return this.alumnosService.create(dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.alumnosService.findAll(req.user.id);
  }

  @Get('perfil/:alumnoCursoId')
  getPerfilAlumno(
    @Param('alumnoCursoId')
    alumnoCursoId: string,
    @Req() req: any,
  ) {
    return this.alumnosService.getPerfilAlumno(
      Number(alumnoCursoId),
      req.user.id,
    );
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
    @Req() req: any,
  ) {
    return this.alumnosService.findOne(
      Number(id),
      req.user.id,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAlumnoDto,
    @Req() req: any,
  ) {
    return this.alumnosService.update(
      Number(id),
      dto,
      req.user.id,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.alumnosService.remove(
      Number(id),
      req.user.id,
    );
  }
}