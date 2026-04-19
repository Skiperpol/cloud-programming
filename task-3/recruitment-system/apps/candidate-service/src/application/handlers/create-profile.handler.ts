import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CandidateProfile } from '../../domain/candidate-profile';
import { CandidateLogger } from '../../infrastructure/logging/candidate.logger';
import { CreateProfileCommand } from '../commands/create-profile.command';
import { CANDIDATE_READ_PORT } from '../ports/candidate-read.port';
import type { CandidateReadPort } from '../ports/candidate-read.port';
import { CANDIDATE_REPOSITORY_PORT } from '../ports/candidate-repository.port';
import type { CandidateRepositoryPort } from '../ports/candidate-repository.port';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(
    @Inject(CANDIDATE_READ_PORT)
    private readonly candidateReadPort: CandidateReadPort,
    @Inject(CANDIDATE_REPOSITORY_PORT)
    private readonly candidateRepository: CandidateRepositoryPort,
    private readonly logger: CandidateLogger,
  ) {}

  async execute(command: CreateProfileCommand): Promise<void> {
    const profile = CandidateProfile.forEmail(command.email);
    this.logger.createProfileCommand(profile.email);
    const existing = await this.candidateReadPort.findByEmail(profile.email);
    if (!existing) {
      await this.candidateRepository.save({ email: profile.email });
    }
  }
}
