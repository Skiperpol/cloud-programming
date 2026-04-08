import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { APPLICATION_SUBMITTED } from '../../../../../libs/shared/events';
import { CreateProfileUseCase } from '../../application/use-cases/create-profile.use-case';

@Controller()
export class CandidateMessageHandler {
  constructor(private readonly createProfileUseCase: CreateProfileUseCase) {}

  @EventPattern(APPLICATION_SUBMITTED)
  async onApplicationSubmitted(
    @Payload() payload: { email: string },
  ): Promise<void> {
    await this.createProfileUseCase.createProfile(payload.email);
  }
}
