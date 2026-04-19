import { Controller, Get } from '@nestjs/common';
import { ListBlacklistEntriesUseCase } from '../../application/use-cases/list-blacklist-entries.use-case';
import { BlacklistEntryEntity } from '../../infrastructure/persistence/blacklist-entry.entity';

@Controller('verification')
export class VerificationController {
  constructor(
    private readonly listBlacklistEntriesUseCase: ListBlacklistEntriesUseCase,
  ) {}

  @Get('blacklist')
  list(): Promise<BlacklistEntryEntity[]> {
    return this.listBlacklistEntriesUseCase.execute();
  }
}
