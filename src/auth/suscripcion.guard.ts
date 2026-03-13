import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { PrismaService } from '../prisma/prisma.service';
  import { IS_PUBLIC_KEY } from './public.decorator';
  
  @Injectable()
  export class SuscripcionGuard implements CanActivate {
    constructor(
      private prisma: PrismaService,
      private reflector: Reflector,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
  
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      if (isPublic) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) {
        return false;
      }
  
      const docente = await this.prisma.docente.findUnique({
        where: { id: user.id },
        include: { suscripcion: true },
      });
  
      if (!docente?.suscripcion) {
        throw new ForbiddenException('No tienes suscripción activa');
      }
  
      if (docente.suscripcion.estado !== 'activa' && docente.suscripcion.estado !== 'prueba') {
        throw new ForbiddenException('Tu suscripción no está activa');
      }
  
      const hoy = new Date();
  
      if (docente.suscripcion.fechaFin && docente.suscripcion.fechaFin < hoy) {
        throw new ForbiddenException('Tu suscripción ha vencido');
      }
  
      return true;
    }
  }