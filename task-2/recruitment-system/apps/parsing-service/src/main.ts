import { NestFactory } from '@nestjs/core';
import { ParsingServiceModule } from './parsing-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ParsingServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
