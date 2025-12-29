import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocentesModule } from './docentes/docentes.module';
import { CursosModule } from './cursos/cursos.module';
import { AlumnosModule } from './alumnos/alumnos.module';

@Module({
  imports: [PrismaModule ,DocentesModule, CursosModule, AlumnosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
