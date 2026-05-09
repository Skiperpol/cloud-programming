import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { QrCodeModule } from './qr-code/qr-code.module';

@Module({
  imports: [HealthModule, QrCodeModule],
})
export class AppModule {}
