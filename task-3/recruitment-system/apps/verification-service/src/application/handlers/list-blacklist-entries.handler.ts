import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BLACKLIST_READ_PORT } from '../ports/blacklist-read.port';
import type { BlacklistReadPort } from '../ports/blacklist-read.port';
import {
  ListBlacklistEntriesQuery,
  ListBlacklistEntriesQueryResult,
} from '../queries/list-blacklist-entries.query';

@QueryHandler(ListBlacklistEntriesQuery)
export class ListBlacklistEntriesHandler implements IQueryHandler<
  ListBlacklistEntriesQuery,
  ListBlacklistEntriesQueryResult
> {
  constructor(
    @Inject(BLACKLIST_READ_PORT)
    private readonly blacklistReadPort: BlacklistReadPort,
  ) {}

  async execute(): Promise<ListBlacklistEntriesQueryResult> {
    const entries = await this.blacklistReadPort.findAll();
    return { entries };
  }
}
