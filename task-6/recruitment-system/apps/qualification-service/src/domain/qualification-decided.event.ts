import { QualificationStatus } from './qualification-status.enum';

export class DecisionMadeEvent {
  constructor(
    public readonly email: string,
    public readonly result: QualificationStatus,
  ) {}
}
