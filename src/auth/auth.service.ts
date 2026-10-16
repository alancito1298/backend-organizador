import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Resend } from 'resend';
import { randomUUID } from 'crypto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private resend:Resend;
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

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

    // Asignar automáticamente Plan Gratis (4 cursos) para que tenga permisos inmediatos
    const planGratis = await this.prisma.plan.findFirst({
      where: { nombre: 'Gratis', activo: true },
    });

    if (planGratis) {
      await this.prisma.suscripcion.create({
        data: {
          docenteId: docente.id,
          planId: planGratis.id,
          estado: 'activa',
          proveedor: 'gratis',
          periodo: 'gratis',
          fechaInicio: new Date(),
          fechaFin: null,
          autoRenovacion: false,
        },
      });
    }

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

    // Verificar si es usuario 51 para notificar a Alan
    await this.verificarYNotificarUsuarioEspecial(docente);

    // Actualizar último acceso
    await this.prisma.docente.update({
      where: { id: docente.id },
      data: { ultimoAcceso: new Date() },
    });

    // Generar token
    return this.generarToken(docente.id, docente.email, docente.nombre);
  }

  async verificarYNotificarUsuarioEspecial(docente: {
    id: number;
    email: string;
    nombre: string;
    apellido?: string | null;
    ultimoAcceso: Date | null;
  }) {
    if (docente.id !== 51) return;

    // Cooldown de 1 hora entre alertas consecutivas
    const tiempoDesdeUltimo = docente.ultimoAcceso
      ? Date.now() - new Date(docente.ultimoAcceso).getTime()
      : Infinity;

    const COOLDOWN_MS = 60 * 60 * 1000; // 1 hora
    if (tiempoDesdeUltimo < COOLDOWN_MS) return;

    try {
      const horaArg = new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        dateStyle: 'full',
        timeStyle: 'medium',
      });

      const apellidoStr = docente.apellido ? ` ${docente.apellido.trim()}` : '';

      await this.resend.emails.send({
        from: 'noreply@organizadordocente.com',
        to: 'alangerman98@yahoo.com.ar',
        subject: '🔔 Alerta: Katherine (Usuario 51) ingresó a Organizador Docente',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;">
            <h2 style="color:#7c3aed;margin-top:0;">🔔 Usuario 51 Activo</h2>
            <p style="font-size:16px;color:#334155;">
              La docente <strong>${docente.nombre.trim()}${apellidoStr}</strong> acaba de ingresar a la app/web.
            </p>
            <div style="background:#f8fafc;padding:16px;border-radius:8px;margin:16px 0;font-size:14px;color:#475569;border-left:4px solid #7c3aed;">
              <p style="margin:4px 0;"><strong>ID:</strong> ${docente.id}</p>
              <p style="margin:4px 0;"><strong>Email:</strong> ${docente.email}</p>
              <p style="margin:4px 0;"><strong>Fecha y Hora:</strong> ${horaArg} (Arg)</p>
            </div>
            <p style="font-size:12px;color:#94a3b8;margin-top:20px;">
              Notificación automática configurada para Alan.
            </p>
          </div>
        `,
      });
      console.log('[ALERTA] Email enviado a alangerman98@yahoo.com.ar por ingreso de usuario 51');
    } catch (err) {
      console.error('[ALERTA] Error al enviar email de aviso por usuario 51:', err);
    }
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
 
  // =====================
  // LOGIN / REGISTRO CON GOOGLE
  // =====================
  async loginWithGoogle(credential: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedException('Token de Google inválido');
    }

    let docente = await this.prisma.docente.findUnique({
      where: { email: payload.email },
    });

    let isNewUser = false;

    if (!docente) {
      isNewUser = true;
      const randomPassword = await bcrypt.hash(randomUUID(), 10);

      docente = await this.prisma.docente.create({
        data: {
          nombre: payload.given_name || payload.name || 'Docente',
          apellido: payload.family_name || '',
          email: payload.email,
          password: randomPassword,
          proveedorAuth: 'google',
        },
      });

      // Asignar automáticamente Plan Gratis (4 cursos) para nuevo usuario de Google
      const planGratis = await this.prisma.plan.findFirst({
        where: { nombre: 'Gratis', activo: true },
      });

      if (planGratis) {
        await this.prisma.suscripcion.create({
          data: {
            docenteId: docente.id,
            planId: planGratis.id,
            estado: 'activa',
            proveedor: 'gratis',
            periodo: 'gratis',
            fechaInicio: new Date(),
            fechaFin: null,
            autoRenovacion: false,
          },
        });
      }
    }

    if (!isNewUser) {
      await this.verificarYNotificarUsuarioEspecial(docente);
      await this.prisma.docente.update({
        where: { id: docente.id },
        data: { ultimoAcceso: new Date() },
      });
    }

    return {
      ...this.generarToken(docente.id, docente.email, docente.nombre),
      isNewUser,
    };
  }

  private generarToken(id: number, email: string, nombre: string) {
    const payload = { sub: id, email, nombre };
    return { access_token: this.jwtService.sign(payload) };
  }


}
