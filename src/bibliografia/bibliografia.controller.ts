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
  import { BibliografiaService } from './bibliografia.service';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { CreateBibliografiaDto } from './dto/create-bibliografia.dto';
  
  @UseGuards(JwtAuthGuard)
  @Controller('bibliografia')
  export class BibliografiaController {
    constructor(private readonly bibliografiaService: BibliografiaService) {}
  
    @Post()
    create(@Body() dto: CreateBibliografiaDto, @Req() req: any) {
      return this.bibliografiaService.create(dto, req.user.id);
    }
  
    @Get()
    findAll(@Req() req: any) {
      return this.bibliografiaService.findByDocente(req.user.id);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
      return this.bibliografiaService.remove(id, req.user.id);
    }
  }
  