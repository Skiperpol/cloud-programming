import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QualificationDecisionEntity } from '../../infrastructure/persistence/entities/qualification-decision.entity';
import { QualificationStatus } from '../../domain/qualification-status.enum';
import { DecisionMadeEvent } from '../../domain/qualification-decided.event';
import { QUALIFICATION_EVENT_PUBLISHER } from '../ports/qualification-event.publisher.port';
import type { QualificationEventPublisherPort } from '../ports/qualification-event.publisher.port';

export interface EvaluateCandidateCommand {
  email: string;
  skills: string[];
  isBlacklisted: boolean;
}

@Injectable()
export class EvaluateCandidateUseCase {
  constructor(
    @InjectRepository(QualificationDecisionEntity)
    private readonly decisionRepository: Repository<QualificationDecisionEntity>,
    @Inject(QUALIFICATION_EVENT_PUBLISHER)
    private readonly eventPublisher: QualificationEventPublisherPort,
  ) {}

  async execute(
    command: EvaluateCandidateCommand,
  ): Promise<QualificationStatus> {
    const hasJava = command.skills.some(
      (skill) => skill.toLowerCase() === 'java',
    );
    const status =
      hasJava && !command.isBlacklisted
        ? QualificationStatus.QUALIFIED
        : QualificationStatus.REJECTED;

    await this.decisionRepository.save({
      email: command.email,
      result: status,
    });

    this.eventPublisher.publishDecisionMade(
      new DecisionMadeEvent(command.email, status),
    );

    return status;
  }
}
