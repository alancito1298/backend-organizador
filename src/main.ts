import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SuscripcionGuard } from './auth/suscripcion.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://organizador-rho.vercel.app',
      'https://organizador-dowo.vercel.app',
      'https://backend-organizador.vercel.app',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    app.get(SuscripcionGuard),
  );

  await app.listen(3000);
  logger.log('Backend corriendo en http://localhost:3000');
}

bootstrap();