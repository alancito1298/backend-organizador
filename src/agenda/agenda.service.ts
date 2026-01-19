import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Injectable()
export class AgendaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear evento en agenda del docente
   */
  create(dto: CreateAgendaDto, docenteId: number) {
    return this.prisma.agenda.create({
      data: {
        fecha: new Date(dto.fecha),
        descripcion: dto.descripcion,
        docenteId,
      },
    });
  }

  /**
   * Obtener agenda del docente logueado
   */
  findAllByDocente(docenteId: number) {
    return this.prisma.agenda.findMany({
      where: { docenteId },
      orderBy: { fecha: 'asc' },
    });
  }

  /**
   * Eliminar evento (solo si es del docente)
   */
  async remove(id: number, docenteId: number) {
    const evento = await this.prisma.agenda.findFirst({
      where: { id, docenteId },
    });

    if (!evento) {
      throw new NotFoundException('Evento no encontrado');
    }

    return this.prisma.agenda.delete({
      where: { id },
    });
  }
}
