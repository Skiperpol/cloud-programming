import { Module } from '@nestjs/common';
import { CandidateServiceController } from './candidate-service.controller';
import { CandidateServiceService } from './candidate-service.service';

@Module({
  imports: [],
  controllers: [CandidateServiceController],
  providers: [CandidateServiceService],
})
export class CandidateServiceModule {}
