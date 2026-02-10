import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';

@Module({
  controllers: [HorariosController],
  providers: [HorariosService, PrismaService]
})
export class HorariosModule {}
