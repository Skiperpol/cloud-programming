import { QualificationDecisionDto } from '../dto/qualification-decision.dto';

export const QUALIFICATION_DECISION_REPOSITORY_PORT =
  'QUALIFICATION_DECISION_REPOSITORY_PORT';

export interface QualificationDecisionRepositoryPort {
  save(
    decision: Pick<QualificationDecisionDto, 'email' | 'result'>,
  ): Promise<void>;
  findAll(): Promise<QualificationDecisionDto[]>;
}
