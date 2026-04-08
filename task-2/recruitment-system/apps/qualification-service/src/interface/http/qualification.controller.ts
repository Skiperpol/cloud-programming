import { Body, Controller, Get, Post } from '@nestjs/common';
import { EvaluateCandidateUseCase } from '../../application/use-cases/evaluate-candidate.use-case';
import { ListQualificationDecisionsUseCase } from '../../application/use-cases/list-qualification-decisions.use-case';
import { EvaluateDecisionDto } from './dto/evaluate-decision.dto';
import { QualificationDecisionEntity } from '../../infrastructure/persistence/entities/qualification-decision.entity';

@Controller('qualification')
export class QualificationController {
  constructor(
    private readonly evaluateCandidateUseCase: EvaluateCandidateUseCase,
    private readonly listQualificationDecisionsUseCase: ListQualificationDecisionsUseCase,
  ) {}

  @Get('health')
  healthCheck(): { status: string; service: string } {
    return {
      status: 'ok',
      service: 'qualification-service',
    };
  }

  @Get('decisions')
  list(): Promise<QualificationDecisionEntity[]> {
    return this.listQualificationDecisionsUseCase.execute();
  }

  @Post('decision')
  async decide(
    @Body() body: EvaluateDecisionDto,
  ): Promise<{ decisionMade: string }> {
    const normalizedSkills = Array.isArray(body.skillsReady)
      ? body.skillsReady
      : String(body.skillsReady ?? '')
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean);

    const decisionMade = await this.evaluateCandidateUseCase.execute({
      email: body.email,
      skills: normalizedSkills,
      isBlacklisted: !body.safetyVerified,
    });
    return { decisionMade };
  }
}
