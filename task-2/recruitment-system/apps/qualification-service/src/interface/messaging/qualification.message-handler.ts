import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  SAFETY_VERIFIED,
  SKILLS_READY,
} from '../../../../../libs/shared/events';
import { EvaluateCandidateUseCase } from '../../application/use-cases/evaluate-candidate.use-case';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

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
    private readonly evaluateCandidateUseCase: EvaluateCandidateUseCase,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
    this.logger.info('evaluateCandidate() called after join', {
      applicationId,
      email: current.email,
    });

    await this.evaluateCandidateUseCase.execute({
      email: current.email,
      skills: current.skills,
      isBlacklisted: current.isBlacklisted,
    });
  }
}
