import { Injectable } from '@nestjs/common';

@Injectable()
export class CandidateServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
