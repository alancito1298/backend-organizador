import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocentesModule } from './docentes/docentes.module';
import { CursosModule } from './cursos/cursos.module';

@Module({
  imports: [PrismaModule ,DocentesModule, CursosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
