import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Vite dev server (5173) and vite preview (4173)
  app.enableCors({ origin: ['http://localhost:5173', 'http://localhost:4173'] });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
