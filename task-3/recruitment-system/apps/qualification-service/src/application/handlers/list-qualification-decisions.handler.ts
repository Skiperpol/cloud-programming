import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { QUALIFICATION_DECISION_REPOSITORY_PORT } from '../ports/qualification-decision-repository.port';
import type { QualificationDecisionRepositoryPort } from '../ports/qualification-decision-repository.port';
import {
  ListQualificationDecisionsQuery,
  ListQualificationDecisionsQueryResult,
} from '../queries/list-qualification-decisions.query';

@QueryHandler(ListQualificationDecisionsQuery)
export class ListQualificationDecisionsHandler implements IQueryHandler<
  ListQualificationDecisionsQuery,
  ListQualificationDecisionsQueryResult
> {
  constructor(
    @Inject(QUALIFICATION_DECISION_REPOSITORY_PORT)
    private readonly repository: QualificationDecisionRepositoryPort,
  ) {}

  async execute(): Promise<ListQualificationDecisionsQueryResult> {
    const decisions = await this.repository.findAll();
    return { decisions };
  }
}
