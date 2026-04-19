import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QualificationDecisionDto } from '../../../application/dto/qualification-decision.dto';
import { QualificationDecisionRepositoryPort } from '../../../application/ports/qualification-decision-repository.port';
import { QualificationDecisionEntity } from './qualification-decision.entity';

@Injectable()
export class TypeOrmQualificationDecisionRepositoryAdapter implements QualificationDecisionRepositoryPort {
  constructor(
    @InjectRepository(QualificationDecisionEntity)
    private readonly repository: Repository<QualificationDecisionEntity>,
  ) {}

  async save(
    decision: Pick<QualificationDecisionDto, 'email' | 'result'>,
  ): Promise<void> {
    await this.repository.save({
      email: decision.email,
      result: decision.result,
    });
  }

  async findAll(): Promise<QualificationDecisionDto[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => ({
      id: entity.id,
      email: entity.email,
      result: entity.result,
    }));
  }
}
