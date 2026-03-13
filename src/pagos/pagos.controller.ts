import { Controller, Post, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {

  constructor(private pagosService: PagosService) {}

  @Post()
  crearPago(@Body() body) {

    const { suscripcionId, monto } = body;

    return this.pagosService.crearPago(suscripcionId, monto);

  }

}