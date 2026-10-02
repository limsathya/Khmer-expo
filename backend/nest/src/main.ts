import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(cors({ origin: config.get<string>('CORS_ORIGIN') }));

  const port = Number(config.get<string>('PORT'));
  await app.listen(port);
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();