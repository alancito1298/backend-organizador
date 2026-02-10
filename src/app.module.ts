import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { DocentesModule } from './docentes/docentes.module';
import { CursosModule } from './cursos/cursos.module';
import { AlumnosModule } from './alumnos/alumnos.module';
import { AlumnosCursosModule } from './alumnos-cursos/alumnos-cursos.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { CalificacionesModule } from './calificaciones/calificaciones.module';
import { AgendaModule } from './agenda/agenda.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { AuthModule } from './auth/auth.module';
import { HorariosModule } from './horarios/horarios.module';
import { PlanificacionesModule } from './planificaciones/planificaciones.module';
import { BibliografiaService } from './bibliografia/bibliografia.service';
import { BibliografiaController } from './bibliografia/bibliografia.controller';
import { BibliografiaModule } from './bibliografia/bibliografia.module';
import { PingController } from './ping/ping.controller';


@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DocentesModule,
    CursosModule,
    AlumnosModule,
    AsistenciasModule,
    CalificacionesModule,
    AgendaModule,
    AlumnosCursosModule,
    HorariosModule,
    PlanificacionesModule,
    BibliografiaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    BibliografiaService,
   
  ],
  controllers: [BibliografiaController, PingController],
 
})
export class AppModule {}
