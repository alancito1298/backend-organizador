import { Controller, Get, Req } from '@nestjs/common';
import { SuscripcionesService } from './suscripciones.service';

@Controller('suscripciones')
export class SuscripcionesController {

  constructor(private suscripcionesService: SuscripcionesService) {}

  @Get('estado')
  obtenerEstado(@Req() req) {

    const docenteId = req.user.id;

    return this.suscripcionesService.obtenerSuscripcion(docenteId);
  }

}