import { IQuery } from '@nestjs/cqrs';
import { BlacklistEntryDto } from '../dto/blacklist-entry.dto';

export class ListBlacklistEntriesQuery implements IQuery {}

export interface ListBlacklistEntriesQueryResult {
  entries: BlacklistEntryDto[];
}
