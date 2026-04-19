import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EvaluateCandidateCommand } from '../../application/commands/evaluate-candidate.command';
import { QualificationDecisionDto } from '../../application/dto/qualification-decision.dto';
import { ListQualificationDecisionsQuery } from '../../application/queries/list-qualification-decisions.query';
import { EvaluateDecisionDto } from './dto/evaluate-decision.dto';
import { QualificationStatus } from '../../domain/qualification-status.enum';

@Controller('qualification')
export class QualificationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('health')
  healthCheck(): { status: string; service: string } {
    return {
      status: 'ok',
      service: 'qualification-service',
    };
  }

  @Get('decisions')
  list(): Promise<QualificationDecisionDto[]> {
    return this.queryBus.execute(new ListQualificationDecisionsQuery());
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

    const decisionMade: QualificationStatus = await this.commandBus.execute(
      new EvaluateCandidateCommand(
        body.email,
        normalizedSkills,
        !body.safetyVerified,
      ),
    );
    return { decisionMade };
  }
}
