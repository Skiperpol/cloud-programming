import { CandidateDto } from '../dto/candidate.dto';

export const CANDIDATE_READ_PORT = 'CANDIDATE_READ_PORT';

export interface CandidateReadPort {
  findAll(): Promise<CandidateDto[]>;
  findByEmail(email: string): Promise<CandidateDto | null>;
}
