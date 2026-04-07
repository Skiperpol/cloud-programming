import { NestFactory } from '@nestjs/core';
import { VerificationServiceModule } from './verification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(VerificationServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
