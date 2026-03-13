import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { SuscripcionGuard } from '../src/auth/suscripcion.guard';
import { Reflector } from '@nestjs/core';
import serverless from 'serverless-http';

let cachedServer;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

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

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverless(expressApp);
}

export default async function handler(req, res) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
}