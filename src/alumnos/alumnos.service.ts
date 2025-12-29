import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CreateAlumnoDto } from './dto/create-alumno.dto'
import  {UpdateAlumnoDto} from './dto/update-alumno.dto'
@Injectable()

export class AlumnosService {
  constructor (private prisma: PrismaService) {}

  //crea alumno
  create(dto: CreateAlumnoDto) {
    return this.prisma.alumno.create({
      data: dto,
    })
  }

  findAll () {
    return this.prisma.alumno.findMany()
  }

  // lee uno
  async findOne (id: number) {
    const alumno = await this.prisma.alumno.findUnique({
      where: { id },
    })
    if (!alumno) {
      throw new NotFoundException('Alumno no encontrado')
    }
    return alumno
  }





// actualizar
async update(id: number, dto: UpdateAlumnoDto) {
    await this.findOne(id);

    return this.prisma.alumno.update({
      where: { id },
      data: dto,
    });
  }

  // borrar
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.alumno.delete({
      where: { id },
    });
  }
}