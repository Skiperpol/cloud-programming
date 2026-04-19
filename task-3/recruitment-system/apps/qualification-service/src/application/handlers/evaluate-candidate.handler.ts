import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QualificationStatus } from '../../domain/qualification-status.enum';
import { DecisionMadeEvent } from '../../domain/qualification-decided.event';
import {
  EvaluateCandidateCommand,
  EvaluateCandidateCommandResult,
} from '../commands/evaluate-candidate.command';
import { QUALIFICATION_DECISION_REPOSITORY_PORT } from '../ports/qualification-decision-repository.port';
import type { QualificationDecisionRepositoryPort } from '../ports/qualification-decision-repository.port';
import { QUALIFICATION_EVENT_PUBLISHER } from '../ports/qualification-event.publisher.port';
import type { QualificationEventPublisherPort } from '../ports/qualification-event.publisher.port';

@CommandHandler(EvaluateCandidateCommand)
export class EvaluateCandidateHandler implements ICommandHandler<
  EvaluateCandidateCommand,
  EvaluateCandidateCommandResult
> {
  constructor(
    @Inject(QUALIFICATION_DECISION_REPOSITORY_PORT)
    private readonly decisionRepository: QualificationDecisionRepositoryPort,
    @Inject(QUALIFICATION_EVENT_PUBLISHER)
    private readonly eventPublisher: QualificationEventPublisherPort,
  ) {}

  async execute(
    command: EvaluateCandidateCommand,
  ): Promise<EvaluateCandidateCommandResult> {
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
