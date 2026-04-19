import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistEntryEntity } from '../../infrastructure/persistence/blacklist-entry.entity';

@Injectable()
export class ListBlacklistEntriesUseCase {
  constructor(
    @InjectRepository(BlacklistEntryEntity)
    private readonly repository: Repository<BlacklistEntryEntity>,
  ) {}

  execute(): Promise<BlacklistEntryEntity[]> {
    return this.repository.find();
  }
}
