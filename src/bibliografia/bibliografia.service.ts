import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBibliografiaDto } from './dto/create-bibliografia.dto';

@Injectable()
export class BibliografiaService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear bibliografía del docente
   */
  create(dto: CreateBibliografiaDto, docenteId: number) {
    return this.prisma.bibliografia.create({
      data: {
        tema: dto.tema,
        link: dto.link,
        docenteId,
      },
    });
  }

  /**
   * Listar bibliografía del docente
   */
  findByDocente(docenteId: number) {
    return this.prisma.bibliografia.findMany({
      where: { docenteId },
      orderBy: { id: 'desc' },
    });
  }

  /**
   * Eliminar bibliografía
   */
  remove(id: number, docenteId: number) {
    return this.prisma.bibliografia.deleteMany({
      where: { id, docenteId },
    });
  }
}