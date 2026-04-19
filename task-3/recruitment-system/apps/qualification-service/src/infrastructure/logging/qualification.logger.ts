import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class QualificationLogger {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  evaluateCandidateAfterJoin(applicationId: string, email: string): void {
    this.logger.info('evaluateCandidate() called after join', {
      applicationId,
      email,
    });
  }
}
