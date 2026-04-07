import { Controller, Get } from '@nestjs/common';
import { VerificationServiceService } from './verification-service.service';

@Controller()
export class VerificationServiceController {
  constructor(private readonly verificationServiceService: VerificationServiceService) {}

  @Get()
  getHello(): string {
    return this.verificationServiceService.getHello();
  }
}
