import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );

    app.enableCors({
      origin: '*',
      credentials: true,
    });

    await app.init();
    cachedApp = server;
  }

  return cachedApp;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  app(req, res);
}
