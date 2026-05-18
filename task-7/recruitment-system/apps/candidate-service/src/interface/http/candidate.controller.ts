import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CandidateDto } from '../../application/dto/candidate.dto';
import { ListCandidatesQuery } from '../../application/queries/list-candidates.query';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  list(): Promise<CandidateDto[]> {
    return this.queryBus.execute(new ListCandidatesQuery());
  }
}
