import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocentesModule } from './docentes/docentes.module';
import { CursosModule } from './cursos/cursos.module';
import { AlumnosModule } from './alumnos/alumnos.module';
import { AlumnosCursosService } from './alumnos-cursos/alumnos-cursos.service';
import { AlumnosCursosModule } from './alumnos-cursos/alumnos-cursos.module';
import { AsistenciasController } from './asistencias/asistencias.controller';
import { AsistenciasService } from './asistencias/asistencias.service';
import { AsistenciasModule } from './asistencias/asistencias.module';

@Module({
  imports: [PrismaModule ,DocentesModule, CursosModule, AlumnosModule, AlumnosCursosModule, AsistenciasModule],
  controllers: [AppController, AsistenciasController],
  providers: [AppService, AlumnosCursosService, AsistenciasService],
})
export class AppModule {}
