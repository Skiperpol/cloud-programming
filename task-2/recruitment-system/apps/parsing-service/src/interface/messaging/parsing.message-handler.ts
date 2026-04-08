import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import {
  APPLICATION_SUBMITTED,
  SKILLS_READY,
} from '../../../../../libs/shared/events';
import { ParseDocumentUseCase } from '../../application/use-cases/parse-document.use-case';

@Controller()
export class ParsingMessageHandler {
  constructor(
    private readonly parseDocumentUseCase: ParseDocumentUseCase,
    @Inject('QUALIFICATION_BUS')
    private readonly qualificationBus: ClientProxy,
  ) {}

  @EventPattern(APPLICATION_SUBMITTED)
  async onApplicationSubmitted(
    @Payload() payload: { email: string; applicationId: string },
  ): Promise<void> {
    await this.parseDocumentUseCase.parseDocument(payload.email);
    this.qualificationBus.emit(SKILLS_READY, {
      applicationId: payload.applicationId,
      skills: ['Java', 'SQL'],
    });
  }
}
