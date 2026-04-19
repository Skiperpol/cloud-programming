import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import {
  APPLICATION_SUBMITTED,
  SAFETY_VERIFIED,
} from '../../../../../libs/shared/events';
import { CheckBlacklistStatusUseCase } from '../../application/use-cases/check-blacklist-status.use-case';

@Controller()
export class VerificationMessageHandler {
  constructor(
    private readonly checkBlacklistStatusUseCase: CheckBlacklistStatusUseCase,
    @Inject('QUALIFICATION_BUS')
    private readonly qualificationBus: ClientProxy,
  ) {}

  @EventPattern(APPLICATION_SUBMITTED)
  async onApplicationSubmitted(
    @Payload() payload: { email: string; applicationId: string },
  ): Promise<void> {
    const isBlacklisted =
      await this.checkBlacklistStatusUseCase.checkBlacklistStatus(
        payload.email,
      );
    this.qualificationBus.emit(SAFETY_VERIFIED, {
      applicationId: payload.applicationId,
      email: payload.email,
      isBlacklisted,
    });
  }
}
