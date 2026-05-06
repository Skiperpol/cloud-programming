import { IQuery } from '@nestjs/cqrs';

export class CheckBlacklistStatusQuery implements IQuery {
  constructor(public readonly email: string) {}
}

export interface CheckBlacklistStatusQueryResult {
  isBlacklisted: boolean;
}
