import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateDto } from '../../application/dto/candidate.dto';
import { CandidateReadPort } from '../../application/ports/candidate-read.port';
import { CandidateEntity } from './candidate.entity';

@Injectable()
export class TypeOrmCandidateReadAdapter implements CandidateReadPort {
  constructor(
    @InjectRepository(CandidateEntity)
    private readonly repository: Repository<CandidateEntity>,
  ) {}

  async findAll(): Promise<CandidateDto[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => ({ id: entity.id, email: entity.email }));
  }

  async findByEmail(email: string): Promise<CandidateDto | null> {
    const entity = await this.repository.findOne({ where: { email } });
    if (!entity) {
      return null;
    }
    return { id: entity.id, email: entity.email };
  }
}
