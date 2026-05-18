import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LoggingInterceptor } from '../../../libs/shared/logging/logging.interceptor';
import { setupSwagger } from '../../../libs/shared/swagger/setup-swagger';
import { GatewayServiceModule } from './gateway-service.module';

async function bootstrap() {
  process.env.SERVICE_NAME = 'gateway-service';
  const app = await NestFactory.create(GatewayServiceModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(app.get(LoggingInterceptor));
  setupSwagger(app, 'gateway-service');
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
