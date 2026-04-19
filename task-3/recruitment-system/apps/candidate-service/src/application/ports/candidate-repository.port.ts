import { CandidateDto } from '../dto/candidate.dto';

export const CANDIDATE_REPOSITORY_PORT = 'CANDIDATE_REPOSITORY_PORT';

export interface CandidateRepositoryPort {
  save(candidate: Pick<CandidateDto, 'email'>): Promise<void>;
}
