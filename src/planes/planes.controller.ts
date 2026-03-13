import { Controller, Get } from '@nestjs/common';
import { PlanesService } from './planes.service';
import { Public } from '../auth/public.decorator';

@Controller('planes')
export class PlanesController {

  constructor(private planesService: PlanesService) {}

  @Public()
  @Get()
  obtenerPlanes() {
    return this.planesService.obtenerPlanes();
  }

}