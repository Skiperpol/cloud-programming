import { IQuery } from '@nestjs/cqrs';
import { QualificationDecisionDto } from '../dto/qualification-decision.dto';

export class ListQualificationDecisionsQuery implements IQuery {}

export interface ListQualificationDecisionsQueryResult {
  decisions: QualificationDecisionDto[];
}
