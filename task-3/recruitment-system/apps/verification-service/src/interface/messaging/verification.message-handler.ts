import { Controller, Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { APPLICATION_SUBMITTED } from '../../../../../libs/shared/events';
import { CheckBlacklistStatusQuery } from '../../application/queries/check-blacklist-status.query';
import { SAFETY_EVENT_PUBLISHER } from '../../application/ports/safety-event.publisher.port';
import type { SafetyEventPublisherPort } from '../../application/ports/safety-event.publisher.port';

@Controller()
export class VerificationMessageHandler {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(SAFETY_EVENT_PUBLISHER)
    private readonly safetyEventPublisher: SafetyEventPublisherPort,
  ) {}

  @EventPattern(APPLICATION_SUBMITTED)
  async onApplicationSubmitted(
    @Payload() payload: { email: string; applicationId: string },
  ): Promise<void> {
    const isBlacklisted: boolean = await this.queryBus.execute(
      new CheckBlacklistStatusQuery(payload.email),
    );
    this.safetyEventPublisher.publishSafetyVerified({
      applicationId: payload.applicationId,
      email: payload.email,
      isBlacklisted,
    });
  }
}
