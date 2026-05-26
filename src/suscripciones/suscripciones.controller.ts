import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SuscripcionesService } from './suscripciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SkipSuscripcion } from '../auth/skip-suscripcion';

@Controller('suscripciones')
@UseGuards(JwtAuthGuard)
export class SuscripcionesController {
  constructor(private suscripcionesService: SuscripcionesService) {}

  @Get('estado')
  obtenerEstado(@Req() req) {
    const docenteId = req.user.id;
    return this.suscripcionesService.obtenerSuscripcion(docenteId);
  }

  @SkipSuscripcion()
  @Post('checkout')
  crearCheckout(@Body() body: { planMpId: string }, @Req() req) {
    const docenteId = req.user.id;
    return this.suscripcionesService.crearCheckout(body.planMpId, docenteId);
  }
}