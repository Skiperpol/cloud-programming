import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  SAFETY_VERIFIED,
  SKILLS_READY,
} from '../../../../../libs/shared/events';
import { EvaluateCandidateCommand } from '../../application/commands/evaluate-candidate.command';
import { QualificationLogger } from '../../infrastructure/logging/qualification.logger';

interface SkillsReadyPayload {
  applicationId: string;
  email: string;
  skills: string[];
}

interface SafetyVerifiedPayload {
  applicationId: string;
  email: string;
  isBlacklisted: boolean;
}

interface QualificationAggregate {
  email?: string;
  skills?: string[];
  isBlacklisted?: boolean;
  processed: boolean;
}

@Controller()
export class QualificationMessageHandler {
  private readonly pendingByApplicationId = new Map<
    string,
    QualificationAggregate
  >();

  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: QualificationLogger,
  ) {}

  @EventPattern(SKILLS_READY)
  async onSkillsReady(@Payload() payload: SkillsReadyPayload): Promise<void> {
    const current = this.pendingByApplicationId.get(payload.applicationId) ?? {
      processed: false,
    };
    current.email = payload.email;
    current.skills = payload.skills;
    this.pendingByApplicationId.set(payload.applicationId, current);
    await this.tryEvaluate(payload.applicationId);
  }

  @EventPattern(SAFETY_VERIFIED)
  async onSafetyVerified(
    @Payload() payload: SafetyVerifiedPayload,
  ): Promise<void> {
    const current = this.pendingByApplicationId.get(payload.applicationId) ?? {
      processed: false,
    };
    current.email = payload.email;
    current.isBlacklisted = payload.isBlacklisted;
    this.pendingByApplicationId.set(payload.applicationId, current);
    await this.tryEvaluate(payload.applicationId);
  }

  private async tryEvaluate(applicationId: string): Promise<void> {
    const current = this.pendingByApplicationId.get(applicationId);
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

    current.processed = true;
    this.logger.evaluateCandidateAfterJoin(applicationId, current.email);

    await this.commandBus.execute(
      new EvaluateCandidateCommand(
        current.email,
        current.skills,
        current.isBlacklisted,
      ),
    );
  }
}
