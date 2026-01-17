import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DocentesService {
  constructor(private prisma: PrismaService) {}



//Crea docente
async create(dto: CreateDocenteDto) {
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  return this.prisma.docente.create({
    data: {
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      password: hashedPassword, 
    },
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



