import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://organizador-rho.vercel.app',
      'https://organizador-dowo.vercel.app',
      'https://organizador-dowo-git-develop-alancito1298s-projects.vercel.app',
      'https://backend-organizador.vercel.app',
      'https://organizadordocente.com',       
      'https://www.organizadordocente.com',   
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log('Backend corriendo en http://localhost:3000');
}

bootstrap();