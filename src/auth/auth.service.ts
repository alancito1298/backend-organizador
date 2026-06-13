import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private resend:Resend;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { this.resend = new Resend(process.env.RESEND_API_KEY);}

  /**
   * REGISTRO DE DOCENTE
   */
  async register(dto: RegisterDto) {
    //  Verificar si el email ya existe
    const existe = await this.prisma.docente.findUnique({
      where: { email: dto.email },
    });

    if (existe) {
      throw new ConflictException('El email ya está registrado');
    }

    //  Hashear password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const docente = await this.prisma.docente.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        password: hashedPassword,
        telefono: dto.telefono,
        provincia: dto.provincia,
        localidad: dto.localidad,
        fechaNacimiento: dto.fechaNacimiento,
      },
    });

    //  Generar token
    return this.generarToken(docente.id, docente.email, docente.nombre);
  }

  
  async login(dto: LoginDto) {
    //  Buscar docente por email
   // console.log('DTO:', dto);
    const docente = await this.prisma.docente.findUnique({
      where: { email: dto.email },
      
    });

    if (!docente) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    //  Comparar password
    const passwordValido = await bcrypt.compare(
      dto.password,
      docente.password,
    );

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    //  Generar token
    return this.generarToken(docente.id, docente.email,docente.nombre);
  }



// FORGOT PASSWORD
  // =====================
  async forgotPassword(email: string) {
    const docente = await this.prisma.docente.findUnique({ where: { email } });
 
    if (!docente) return { message: 'Si el email existe recibirás un correo' };
 
    // Invalidar tokens anteriores
    await this.prisma.recuperacionPassword.updateMany({
      where: { docenteId: docente.id, usado: false },
      data: { usado: true },
    });
 
    const token     = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
 
    await this.prisma.recuperacionPassword.create({
      data: { token, docenteId: docente.id, expiresAt },
    });
 
    const link = `${process.env.FRONTEND_URL ?? 'https://organizadordocente.com'}/reset-password?token=${token}`;
 
    await this.resend.emails.send({
      from:    'noreply@organizadordocente.com',
      to:      email,
      subject: 'Recuperación de contraseña - Organizador Docente',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#4c1d95;">Recuperar contraseña</h2>
          <p>Hola <strong>${docente.nombre}</strong>,</p>
          <p>Recibimos una solicitud para restablecer tu contraseña. Hacé clic en el botón para continuar:</p>
          <a href="${link}" style="display:inline-block;margin:24px 0;background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            Restablecer contraseña
          </a>
          <p style="color:#6b7280;font-size:13px;">Este link expira en 1 hora. Si no solicitaste este cambio, ignorá este email.</p>
        </div>
      `,
    });
 
    return { message: 'Si el email existe recibirás un correo' };
  }
 
  // =====================
  // RESET PASSWORD
  // =====================
  async resetPassword(token: string, nuevaPassword: string) {
    const registro = await this.prisma.recuperacionPassword.findUnique({
      where: { token },
    });
 
    if (!registro || registro.usado) {
      throw new BadRequestException('Token inválido o ya utilizado');
    }
 
    if (new Date() > registro.expiresAt) {
      throw new BadRequestException('El token expiró');
    }
 
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
 
    await this.prisma.docente.update({
      where: { id: registro.docenteId },
      data: { password: hashedPassword },
    });
 
    await this.prisma.recuperacionPassword.update({
      where: { token },
      data: { usado: true },
    });
 
    return { message: 'Contraseña actualizada correctamente' };
  }
 
  private generarToken(id: number, email: string, nombre: string) {
    const payload = { sub: id, email, nombre };
    return { access_token: this.jwtService.sign(payload) };
  }


}
