import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { CandidateEntity } from '../../infrastructure/persistence/candidate.entity';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly repository: Repository<CandidateEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createProfile(email: string): Promise<void> {
    this.logger.info('createProfile() call', { email });
    const existing = await this.repository.findOne({ where: { email } });
    if (!existing) {
      await this.repository.save({ email });
    }
  }
}
