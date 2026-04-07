import { NestFactory } from '@nestjs/core';
import { CandidateServiceModule } from './candidate-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CandidateServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
