import { Controller, Get } from '@nestjs/common';
import { QualificationServiceService } from './qualification-service.service';

@Controller()
export class QualificationServiceController {
  constructor(private readonly qualificationServiceService: QualificationServiceService) {}

  @Get()
  getHello(): string {
    return this.qualificationServiceService.getHello();
  }
}
