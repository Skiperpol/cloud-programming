import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateRepositoryPort } from '../../application/ports/candidate-repository.port';
import { CandidateEntity } from './candidate.entity';

@Injectable()
export class TypeOrmCandidateRepositoryAdapter implements CandidateRepositoryPort {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly repository: Repository<CandidateEntity>,
  ) {}

  async save(candidate: Pick<CandidateEntity, 'email'>): Promise<void> {
    await this.repository.save({ email: candidate.email });
  }
}
