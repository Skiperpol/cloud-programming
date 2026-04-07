import { NestFactory } from '@nestjs/core';
import { GatewayServiceModule } from './gateway-service.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
