import { Controller, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { APPLICATION_SUBMITTED } from '../../../../../libs/shared/events';
import { ParseDocumentCommand } from '../../application/commands/parse-document.command';
import { SKILLS_EVENT_PUBLISHER } from '../../application/ports/skills-event.publisher.port';
import type { SkillsEventPublisherPort } from '../../application/ports/skills-event.publisher.port';
import { ParsedSkillSet } from '../../domain/parsed-skill-set';

@Controller()
export class ParsingMessageHandler {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(SKILLS_EVENT_PUBLISHER)
    private readonly skillsEventPublisher: SkillsEventPublisherPort,
  ) {}

  @EventPattern(APPLICATION_SUBMITTED)
  async onApplicationSubmitted(
    @Payload() payload: { email: string; applicationId: string },
  ): Promise<void> {
    await this.commandBus.execute(new ParseDocumentCommand(payload.email));
    const skills = ParsedSkillSet.stub();
    this.skillsEventPublisher.publishSkillsReady({
      applicationId: payload.applicationId,
      email: payload.email,
      skills: skills.toPersistedArray(),
    });
  }
}
