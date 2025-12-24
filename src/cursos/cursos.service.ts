import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
    constructor(private prisma: PrismaService){}

//Crea Curso
create(dto: CreateCursoDto){
    return this.prisma.curso.create({
        data: {
            escuela: dto.escuela,
            anio: dto.anio,
            materia: dto.materia,
            docente:{
                connect: { id: dto.docenteId},
            }

        }
    })

}

//Lee todo

findAll(){
    return this.prisma.curso.findMany(
        {include:{
            docente: true,
        }}
    )
}

//busca uno
async findOne(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { id },
      include: {
        docente: true,
      },
    });
    if (!curso) {
        throw new NotFoundException('Curso no encontrado');
      }
  
      return curso;
    }

// leer por docente   
    findByDocente(docenteId: number) {
        return this.prisma.curso.findMany({
          where: { docenteId },
        });
      }

// actualizar docente
  async update(id: number, dto: UpdateCursoDto) {
    await this.findOne(id);

    return this.prisma.curso.update({
      where: { id },
      data: dto,
    });
  }

// borrar docente
async remove(id: number) {
    await this.findOne(id);

    return this.prisma.curso.delete({
      where: { id },
    });
  }

}






