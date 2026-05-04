import { QualificationStatus } from '../../domain/qualification-status.enum';

export interface QualificationDecisionDto {
  id: string;
  email: string;
  result: QualificationStatus;
}
