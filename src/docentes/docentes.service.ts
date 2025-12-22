import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';

@Injectable()
export class DocentesService {
  constructor(private prisma: PrismaService) {}



//Crea docente
 create(dto: CreateDocenteDto) {
  return this.prisma.docente.create({
    data: dto,
  });
}

// Trae * docentes
findAll() {
  return this.prisma.docente.findMany();
}

//Leer uno
async findOne(id:number){
  const docente = await this.prisma.docente.findUnique({
    where: { id },
  });
  
  if (!docente) {
    throw new NotFoundException('Docente no encontrado');
  }
  
  return docente;
}


//Actualizar docente
async update(id: number, dto: UpdateDocenteDto) {
  await this.findOne(id); // valida existencia

  return this.prisma.docente.update({
    where: { id },
    data: dto,
  });
}

 // Borra Docente
 async remove(id: number) {
  await this.findOne(id); // valida existencia

  return this.prisma.docente.delete({
    where: { id },
  });


}}



