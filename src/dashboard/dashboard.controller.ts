import {
    Controller,
    Get,
    Param,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import { DashboardService }
  from './dashboard.service';
  
  import { JwtAuthGuard }
  from '../auth/jwt-auth.guard';
  
  @UseGuards(JwtAuthGuard)
  @Controller('dashboard')
  export class DashboardController {
  
    constructor(
      private readonly dashboardService:
      DashboardService
    ) {}
  
    // =========================
    // RESUMEN DOCENTE
    // =========================
    @Get('resumen')
    resumen(@Req() req: any) {
  
      return this.dashboardService
        .resumen(req.user.id);
  
    }
  
    // =========================
    // PERFIL ALUMNO
    // =========================
    @Get('alumno/:id')
    alumno(
      @Param('id') id: string,
      @Req() req: any,
    ) {
  
      return this.dashboardService
        .perfilAlumno(
          Number(id),
          req.user.id,
        );
  
    }
  
  }