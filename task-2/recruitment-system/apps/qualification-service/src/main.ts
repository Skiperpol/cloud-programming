import { NestFactory } from '@nestjs/core';
import { QualificationServiceModule } from './qualification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(QualificationServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
