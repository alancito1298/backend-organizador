import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { AgendaService } from './agenda.service';
  import { CreateAgendaDto } from './dto/create-agenda.dto';
  import { UpdateAgendaDto } from './dto/update-agenda.dto';
  
  @Controller('agenda')
  export class AgendaController {
    constructor(private readonly agendaService: AgendaService) {}
  
    // Crear evento
    @Post()
    create(@Body() dto: CreateAgendaDto) {
      return this.agendaService.create(dto);
    }
  
    // Agenda del docente
    @Get('docente/:id')
    findByDocente(@Param('id') id: string) {
      return this.agendaService.findByDocente(Number(id));
    }
  
    // Editar evento
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() dto: UpdateAgendaDto,
    ) {
      return this.agendaService.update(Number(id), dto);
    }
  
    // Eliminar evento
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.agendaService.remove(Number(id));
    }
  }
  