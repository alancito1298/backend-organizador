import { Controller, Post, Body, Req } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private pagosService: PagosService) {}

  @Post()
  crearPago(@Body() body: any, @Req() req: any) {
    const { suscripcionId, monto } = body;
    return this.pagosService.crearPago(Number(suscripcionId), Number(monto), req.user.id);
  }
}