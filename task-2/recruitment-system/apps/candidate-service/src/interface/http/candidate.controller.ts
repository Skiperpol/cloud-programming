import { Controller, Get } from '@nestjs/common';
import { ListCandidatesUseCase } from '../../application/use-cases/list-candidates.use-case';
import { CandidateEntity } from '../../infrastructure/persistence/candidate.entity';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly listCandidatesUseCase: ListCandidatesUseCase) {}

  @Get()
  list(): Promise<CandidateEntity[]> {
    return this.listCandidatesUseCase.execute();
  }
}
