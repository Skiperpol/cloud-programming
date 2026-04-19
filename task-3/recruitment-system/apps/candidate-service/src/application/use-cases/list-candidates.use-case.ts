import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateEntity } from '../../infrastructure/persistence/candidate.entity';

@Injectable()
export class ListCandidatesUseCase {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly repository: Repository<CandidateEntity>,
  ) {}

  execute(): Promise<CandidateEntity[]> {
    return this.repository.find();
  }
}
