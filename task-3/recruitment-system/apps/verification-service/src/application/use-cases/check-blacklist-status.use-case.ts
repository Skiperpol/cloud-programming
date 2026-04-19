import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { BlacklistEntryEntity } from '../../infrastructure/persistence/blacklist-entry.entity';

@Injectable()
export class CheckBlacklistStatusUseCase {
  constructor(
    @InjectRepository(BlacklistEntryEntity)
    private readonly repository: Repository<BlacklistEntryEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async checkBlacklistStatus(email: string): Promise<boolean> {
    this.logger.info('checkBlacklistStatus() call', { email });
    const found = await this.repository.findOne({ where: { email } });
    return Boolean(found?.blocked);
  }
}
