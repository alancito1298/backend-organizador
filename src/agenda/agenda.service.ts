import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Injectable()
export class AgendaService {
  constructor(private prisma: PrismaService) {}

  // Crear evento
  create(dto: CreateAgendaDto) {
    return this.prisma.agenda.create({
      data: {
        fecha: new Date(dto.fecha),
        descripcion: dto.descripcion,
        docenteId: dto.docenteId,
      },
    });
  }

  // Agenda por docente (ordenada por fecha)
  findByDocente(docenteId: number) {
    return this.prisma.agenda.findMany({
      where: { docenteId },
      orderBy: { fecha: 'asc' },
    });
  }

  // Editar evento
  async update(id: number, dto: UpdateAgendaDto) {
    const evento = await this.prisma.agenda.findUnique({ where: { id } });
    if (!evento) throw new NotFoundException('Evento no encontrado');

    return this.prisma.agenda.update({
      where: { id },
      data: {
        descripcion: dto.descripcion,
        fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      },
    });
  }

  // Eliminar evento
  remove(id: number) {
    return this.prisma.agenda.delete({
      where: { id },
    });
  }
}
