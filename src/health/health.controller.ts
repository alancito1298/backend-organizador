import { Controller, Get } from '@nestjs/common';
import { Public } from '../../src/auth/public.decorator'; // ajustá ruta si hace falta

@Controller('test')
export class HealthController {

  @Public()
  @Get()
  test() {
    return { ok: true };
  }
}
