import { Controller, Get } from '@nestjs/common';
import { CandidateServiceService } from './candidate-service.service';

@Controller()
export class CandidateServiceController {
  constructor(private readonly candidateServiceService: CandidateServiceService) {}

  @Get()
  getHello(): string {
    return this.candidateServiceService.getHello();
  }
}
