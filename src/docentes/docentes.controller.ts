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
import { DocentesService } from './docentes.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { Public } from '../auth/public.decorator';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  // Contador público de docentes registrados (último ID)
  @Public()
  @Get('public/contador')
  getContador() {
    return this.docentesService.getContadorPublico();
  }

  // Crear
  @Post()
  create(@Body() dto: CreateDocenteDto) {
    return this.docentesService.create(dto);
  }

  // Obtener perfil del docente autenticado
  @Get('perfil')
  getPerfil(@Req() req: any) {
    return this.docentesService.findOne(req.user.id);
  }

  // lee todos los docentes (restringido a mi perfil)
  @Get()
  findAll(@Req() req: any) {
    return this.docentesService.findAll(req.user.id);
  }

  // lee un docente (solo el propio)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.docentesService.findOne(Number(id), req.user.id);
  }

  // Actualizar docente (solo el propio)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDocenteDto,
    @Req() req: any,
  ) {
    return this.docentesService.update(Number(id), dto, req.user.id);
  }

  // Borrar docente (solo el propio)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.docentesService.remove(Number(id), req.user.id);
  }
}
