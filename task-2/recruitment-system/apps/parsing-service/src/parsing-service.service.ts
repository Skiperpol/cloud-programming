import { Injectable } from '@nestjs/common';

@Injectable()
export class ParsingServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
