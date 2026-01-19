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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
   
  ],
 
})
export class AppModule {}
