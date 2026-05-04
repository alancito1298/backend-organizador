import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Controller('test')
export class HealthController {

  @Public()
  @Get()
  test() {
    return { ok: true };
  }
}
