import { ICommand } from '@nestjs/cqrs';
import { QualificationStatus } from '../../domain/qualification-status.enum';

export class EvaluateCandidateCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly skills: string[],
    public readonly isBlacklisted: boolean,
  ) {}
}

export type EvaluateCandidateCommandResult = QualificationStatus;
