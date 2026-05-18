import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { LoggingInterceptor } from '../../../libs/shared/logging/logging.interceptor';
import { setupSwagger } from '../../../libs/shared/swagger/setup-swagger';
import { ParsingServiceModule } from './parsing-service.module';

async function bootstrap() {
  process.env.SERVICE_NAME = 'parsing-service';
  const app = await NestFactory.create(ParsingServiceModule);
  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  setupSwagger(app, 'parsing-service');
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
      queue: process.env.PARSER_QUEUE ?? 'parser.events',
      queueOptions: { durable: true },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
