import { Module } from '@nestjs/common';
import { PlanificacionesController } from './planificaciones.controller';
import { PlanificacionesService } from './planificaciones.service';

@Module({
  controllers: [PlanificacionesController],
  providers: [PlanificacionesService]
})
export class PlanificacionesModule {}
