import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateHorarioDto } from './dto/create-horario.dto';

@Injectable()
export class HorariosService {
  constructor(private prisma: PrismaService) {}


  create(dto: CreateHorarioDto, docenteId: number) {
    return this.prisma.horario.create({
      data: {
        dia: dto.dia,
        hora: dto.hora,
        descripcion: dto.descripcion,
        docenteId,
      },
    });
  }


  findByDocente(docenteId: number) {
    return this.prisma.horario.findMany({
      where: { docenteId },
      orderBy: [
        { dia: 'asc' },
        { hora: 'asc' },
      ],
    });
  }


  async remove(id: number, docenteId: number) {
    return this.prisma.horario.deleteMany({
      where: { id, docenteId },
    });
  }
}