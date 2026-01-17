import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

    //  Crear docente
    const docente = await this.prisma.docente.create({
      data: {
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        password: hashedPassword,
      },
    });

    //  Generar token
    return this.generarToken(docente.id, docente.email);
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
    return this.generarToken(docente.id, docente.email);
  }

  // GENERAR JWT
  private generarToken(id: number, email: string) {
    const payload = {
      sub: id,
      email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
