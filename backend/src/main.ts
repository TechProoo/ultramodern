import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Local dev origins and the production Netlify site are always allowed;
  // extra origins can be added via CORS_ORIGIN as a comma-separated list.
  // NOTE: origins never have a trailing slash.
  const defaults = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://ultramodern.netlify.app',
  ];
  const fromEnv = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: [...defaults, ...fromEnv] });

  // Railway (and most PaaS) inject PORT; bind on all interfaces.
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
