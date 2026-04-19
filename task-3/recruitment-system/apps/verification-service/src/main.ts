import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { LoggingInterceptor } from '../../../libs/shared/logging/logging.interceptor';
import { setupSwagger } from '../../../libs/shared/swagger/setup-swagger';
import { VerificationServiceModule } from './verification-service.module';

async function bootstrap() {
  process.env.SERVICE_NAME = 'verification-service';
  const app = await NestFactory.create(VerificationServiceModule);
  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  setupSwagger(app, 'verification-service');
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: process.env.VERIFICATION_QUEUE ?? 'verification.events',
      queueOptions: { durable: true },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3003);
}
bootstrap();
