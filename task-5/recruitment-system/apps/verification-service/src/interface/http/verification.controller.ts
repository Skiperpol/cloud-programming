import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { BlacklistEntryDto } from '../../application/dto/blacklist-entry.dto';
import { ListBlacklistEntriesQuery } from '../../application/queries/list-blacklist-entries.query';

@Controller('verification')
export class VerificationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('blacklist')
  list(): Promise<BlacklistEntryDto[]> {
    return this.queryBus.execute(new ListBlacklistEntriesQuery());
  }
}
