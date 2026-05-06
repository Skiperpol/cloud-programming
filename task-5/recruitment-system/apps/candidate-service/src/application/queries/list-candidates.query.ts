import { IQuery } from '@nestjs/cqrs';
import { CandidateDto } from '../dto/candidate.dto';

export class ListCandidatesQuery implements IQuery {}

export interface ListCandidatesQueryResult {
  candidates: CandidateDto[];
}
