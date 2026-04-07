import { Injectable } from '@nestjs/common';

@Injectable()
export class QualificationServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
