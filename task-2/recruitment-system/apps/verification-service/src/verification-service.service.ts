import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
