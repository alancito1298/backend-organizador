import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
import { DocentesService } from './docentes.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';



@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  //Crear
  @Post()
  create(@Body() dto: CreateDocenteDto){
    return this.docentesService.create(dto);
  }

  //lee todos los docentes
  @Get()
  findAll(){
    return this.docentesService.findAll();
  }

  //lee un docente
  @Get(':id')
  findOne(@Param('id') id:string){
    return this.docentesService.findOne(Number(id));
  }

  //Actualizar docente
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDocenteDto,
  ){
    return this.docentesService.update(Number(id), dto)
  }

//Borrar docente
@Delete(':id')
remove(@Param('id') id: string) {
  return this.docentesService.remove(Number(id));
}

}