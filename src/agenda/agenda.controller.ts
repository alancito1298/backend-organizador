import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAgendaDto } from './dto/create-agenda.dto';

@UseGuards(JwtAuthGuard)
@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post()
  create(@Body() dto: CreateAgendaDto, @Req() req: any) {
    return this.agendaService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.agendaService.findAllByDocente(req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.agendaService.remove(id, req.user.id);
  }
}
