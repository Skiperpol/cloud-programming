import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { LoggingInterceptor } from '../../../libs/shared/logging/logging.interceptor';
import { setupSwagger } from '../../../libs/shared/swagger/setup-swagger';
import { QualificationServiceModule } from './qualification-service.module';

async function bootstrap() {
  process.env.SERVICE_NAME = 'qualification-service';
  const app = await NestFactory.create(QualificationServiceModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  setupSwagger(app, 'qualification-service');
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: process.env.QUALIFICATION_QUEUE ?? 'qualification.events',
      queueOptions: { durable: true },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3004);
}
bootstrap();
