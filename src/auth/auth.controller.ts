import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService, 
  ) {}

  /**
   * REGISTRO
   */
   @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * LOGIN
   */
   @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
 
  

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const docenteId = Number(req.user.id || req.user.sub);
  
    if (!docenteId) {
      throw new Error("Token inválido");
    }
  
    const docente = await this.prisma.docente.findUnique({
      where: { id: docenteId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
      },
    });
  
    return docente;
  }
  }

