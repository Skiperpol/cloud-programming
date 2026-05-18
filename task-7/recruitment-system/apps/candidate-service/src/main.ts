import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { LoggingInterceptor } from '../../../libs/shared/logging/logging.interceptor';
import { setupSwagger } from '../../../libs/shared/swagger/setup-swagger';
import { CandidateServiceModule } from './candidate-service.module';

async function bootstrap() {
  process.env.SERVICE_NAME = 'candidate-service';
  const app = await NestFactory.create(CandidateServiceModule);
  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  setupSwagger(app, 'candidate-service');
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: process.env.CANDIDATE_QUEUE ?? 'candidate.events',
      queueOptions: { durable: true },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
