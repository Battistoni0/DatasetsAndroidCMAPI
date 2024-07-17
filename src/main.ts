import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configuración para servir archivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'datasets'));

  await app.listen(3000);
}
bootstrap();