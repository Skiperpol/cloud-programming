import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class VerificationLogger {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  checkBlacklistStatusQuery(email: string): void {
    this.logger.info('CheckBlacklistStatusQuery', { email });
  }
}
