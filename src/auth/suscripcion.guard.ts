import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { PrismaService } from '../prisma/prisma.service';
  import { IS_PUBLIC_KEY } from './public.decorator';
  import { SKIP_SUSCRIPCION_KEY } from './skip-suscripcion';
  
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
      
      const skipSuscripcion = this.reflector.getAllAndOverride<boolean>(
        SKIP_SUSCRIPCION_KEY,
        [context.getHandler(), context.getClass()],
      );
      
      if (skipSuscripcion) return true

      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) {
        return false;
      }
  
      const docente = await this.prisma.docente.findUnique({
        where: { id: user.id },
        include: { suscripcion: true },
      });
  
      let suscripcion = docente?.suscripcion;

      if (!suscripcion && docente) {
        const planGratis = await this.prisma.plan.findFirst({
          where: { nombre: 'Gratis', activo: true },
        });

        if (planGratis) {
          suscripcion = await this.prisma.suscripcion.create({
            data: {
              docenteId: docente.id,
              planId: planGratis.id,
              estado: 'activa',
              proveedor: 'gratis',
              periodo: 'gratis',
              fechaInicio: new Date(),
              fechaFin: null,
              autoRenovacion: false,
            },
          });
        }
      }

      if (!suscripcion) {
        throw new ForbiddenException('No tienes suscripción activa');
      }

      if (suscripcion.estado !== 'activa' && suscripcion.estado !== 'prueba' && suscripcion.estado !== 'trial') {
        throw new ForbiddenException('Tu suscripción no está activa');
      }

      const hoy = new Date();

      if (suscripcion.fechaFin && suscripcion.fechaFin < hoy) {
        throw new ForbiddenException('Tu suscripción ha vencido');
      }

      return true;
    }
  }