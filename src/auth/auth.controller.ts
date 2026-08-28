import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { Public } from './public.decorator';
import { Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { SkipSuscripcion } from '../auth/skip-suscripcion';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {}

  /**
   * REGISTRO (Máximo 5 registros por minuto por IP)
   */
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * LOGIN (Máximo 5 intentos por minuto por IP)
   */
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * LOGIN / REGISTRO CON GOOGLE
   */
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('google')
  loginWithGoogle(@Body() dto: GoogleLoginDto) {
    return this.authService.loginWithGoogle(dto.credential);
  }

  @UseGuards(JwtAuthGuard)
  @SkipSuscripcion()
  @Get('me')
  async getProfile(@Req() req: any) {
    const docenteId = Number(req.user.id || req.user.sub);

    if (!docenteId) {
      throw new Error('Token inválido');
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

  /**
   * FORGOT PASSWORD (Máximo 3 solicitudes por minuto por IP para evitar spam de emails)
   */
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }
}

