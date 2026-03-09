import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  Delete
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCursoDto } from './dto/create-curso.dto';

@UseGuards(JwtAuthGuard) // Protege TODO el controller
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  /**
   * Crear un curso 
   */
  @Post()
  create(@Body() dto: CreateCursoDto, @Req() req: any) {
    const docenteId = req.user.id; // 👤 viene del JWT
    return this.cursosService.create(dto, docenteId);
  }

  /**
   * Obtener todos MIS cursos
   */
  @Get()
  findAll(@Req() req: any) {
    const docenteId = req.user.id;
    return this.cursosService.findAllByDocente(docenteId);
  }

  /**
   * Obtener un curso puntual
   */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const docenteId = req.user.id;
    return this.cursosService.findOneByDocente(id, docenteId);
  }
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const docenteId = req.user.id;
    return this.cursosService.remove(id, docenteId);
  }
}
