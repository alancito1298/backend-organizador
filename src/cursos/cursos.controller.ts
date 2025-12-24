import{
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




@Controller('cursos')
export class CursosController {
    constructor(private readonly cursosService: CursosService){}

@Post('cursos')
create(@Body() dto: CreateCursoDto){
    return this.cursosService.create(dto);
    }

@Get('cursos')
findAll(){
return this.cursosService.findAll();
}




}
