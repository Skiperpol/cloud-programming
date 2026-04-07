import { Controller, Get } from '@nestjs/common';
import { ParsingServiceService } from './parsing-service.service';

@Controller()
export class ParsingServiceController {
  constructor(private readonly parsingServiceService: ParsingServiceService) {}

  @Get()
  getHello(): string {
    return this.parsingServiceService.getHello();
  }
}
