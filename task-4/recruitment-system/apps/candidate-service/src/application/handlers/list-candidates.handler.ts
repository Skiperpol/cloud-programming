import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CANDIDATE_READ_PORT } from '../ports/candidate-read.port';
import type { CandidateReadPort } from '../ports/candidate-read.port';
import {
  ListCandidatesQuery,
  ListCandidatesQueryResult,
} from '../queries/list-candidates.query';

@QueryHandler(ListCandidatesQuery)
export class ListCandidatesHandler implements IQueryHandler<
  ListCandidatesQuery,
  ListCandidatesQueryResult
> {
  constructor(
    @Inject(CANDIDATE_READ_PORT)
    private readonly candidateReadPort: CandidateReadPort,
  ) {}

  async execute(): Promise<ListCandidatesQueryResult> {
    const candidates = await this.candidateReadPort.findAll();
    return { candidates };
  }
}
