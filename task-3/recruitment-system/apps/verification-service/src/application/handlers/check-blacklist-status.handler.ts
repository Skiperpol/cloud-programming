import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BlacklistScreeningResult } from '../../domain/blacklist-screening-result';
import { VerificationLogger } from '../../infrastructure/logging/verification.logger';
import { BLACKLIST_READ_PORT } from '../ports/blacklist-read.port';
import type { BlacklistReadPort } from '../ports/blacklist-read.port';
import { CheckBlacklistStatusQuery } from '../queries/check-blacklist-status.query';

@QueryHandler(CheckBlacklistStatusQuery)
export class CheckBlacklistStatusHandler implements IQueryHandler<
  CheckBlacklistStatusQuery,
  boolean
> {
  constructor(
    @Inject(BLACKLIST_READ_PORT)
    private readonly blacklistReadPort: BlacklistReadPort,
    private readonly logger: VerificationLogger,
  ) {}

  async execute(query: CheckBlacklistStatusQuery): Promise<boolean> {
    this.logger.checkBlacklistStatusQuery(query.email);
    const found = await this.blacklistReadPort.findByEmail(query.email);
    return BlacklistScreeningResult.fromEntry(found).isBlacklisted;
  }
}
