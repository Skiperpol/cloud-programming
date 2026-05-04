import { Controller, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  SAFETY_VERIFIED,
  SKILLS_READY,
} from '../../../../../libs/shared/events';
import { EvaluateCandidateCommand } from '../../application/commands/evaluate-candidate.command';
import { QUALIFICATION_JOIN_STORE_PORT } from '../../application/ports/qualification-join-store.port';
import type { QualificationJoinStorePort } from '../../application/ports/qualification-join-store.port';
import type {
  SafetyVerifiedPayload,
  SkillsReadyPayload,
} from './contracts/qualification-events.payload';
import { QualificationLogger } from '../../infrastructure/logging/qualification.logger';

@Controller()
export class QualificationMessageHandler {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: QualificationLogger,
    @Inject(QUALIFICATION_JOIN_STORE_PORT)
    private readonly joinStore: QualificationJoinStorePort,
  ) {}

  @EventPattern(SKILLS_READY)
  async onSkillsReady(@Payload() payload: SkillsReadyPayload): Promise<void> {
    await this.joinStore.upsertSkills(
      payload.applicationId,
      payload.email,
      payload.skills,
    );
    await this.tryEvaluate(payload.applicationId);
  }

  @EventPattern(SAFETY_VERIFIED)
  async onSafetyVerified(
    @Payload() payload: SafetyVerifiedPayload,
  ): Promise<void> {
    await this.joinStore.upsertSafety(
      payload.applicationId,
      payload.email,
      payload.isBlacklisted,
    );
    await this.tryEvaluate(payload.applicationId);
  }

  private async tryEvaluate(applicationId: string): Promise<void> {
    const lockAcquired =
      await this.joinStore.acquireEvaluationLock(applicationId);
    if (!lockAcquired) {
      return;
    }

    try {
      const current = await this.joinStore.getAggregate(applicationId);
      if (!current || current.processed) {
        return;
      }
      if (
        !current.email ||
        !current.skills ||
        typeof current.isBlacklisted !== 'boolean'
      ) {
        return;
      }

      await this.joinStore.markProcessed(applicationId);
      this.logger.evaluateCandidateAfterJoin(applicationId, current.email);

      await this.commandBus.execute(
        new EvaluateCandidateCommand(
          current.email,
          current.skills,
          current.isBlacklisted,
        ),
      );
    } finally {
      await this.joinStore.releaseEvaluationLock(applicationId);
    }
  }
}
