import { Module } from '@nestjs/common';
import { VerificationServiceController } from './verification-service.controller';
import { VerificationServiceService } from './verification-service.service';

@Module({
  imports: [],
  controllers: [VerificationServiceController],
  providers: [VerificationServiceService],
})
export class VerificationServiceModule {}
