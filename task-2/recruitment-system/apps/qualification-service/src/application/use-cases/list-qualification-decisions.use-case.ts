import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QualificationDecisionEntity } from '../../infrastructure/persistence/entities/qualification-decision.entity';

@Injectable()
export class ListQualificationDecisionsUseCase {
  constructor(
    @InjectRepository(QualificationDecisionEntity)
    private readonly repository: Repository<QualificationDecisionEntity>,
  ) {}

  execute(): Promise<QualificationDecisionEntity[]> {
    return this.repository.find();
  }
}
