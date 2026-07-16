import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Local dev origins are always allowed; production origins (the Netlify site)
  // come from CORS_ORIGIN as a comma-separated list, e.g.
  //   CORS_ORIGIN=https://your-site.netlify.app
  const defaults = ['http://localhost:5173', 'http://localhost:4173'];
  const fromEnv = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: [...defaults, ...fromEnv] });

  // Railway (and most PaaS) inject PORT; bind on all interfaces.
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
