import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import serverless from 'serverless-http';

let server;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const logger = new Logger('Bootstrap');

  const allowedOrigins = [
    'http://localhost:3001',
    'https://organizador-rho.vercel.app',
    'https://organizador-dowo.vercel.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      logger.log(`Request desde origin: ${origin ?? 'sin origin'}`);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`Origin bloqueado por CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverless(expressApp);
}

export default async function handler(req, res) {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
}