import { Module } from '@nestjs/common';
import { QrCodeModule } from './qr-code/qr-code.module';

@Module({
  imports: [QrCodeModule],
})
export class AppModule {}
