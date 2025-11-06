import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'
import { scheduleJob } from './engine/service/schedule-service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  scheduleJob()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
