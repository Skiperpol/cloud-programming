import { Module } from '@nestjs/common';
import { QualificationServiceController } from './qualification-service.controller';
import { QualificationServiceService } from './qualification-service.service';

@Module({
  imports: [],
  controllers: [QualificationServiceController],
  providers: [QualificationServiceService],
})
export class QualificationServiceModule {}
