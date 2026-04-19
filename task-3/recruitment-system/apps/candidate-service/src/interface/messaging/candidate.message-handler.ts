import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { APPLICATION_SUBMITTED } from '../../../../../libs/shared/events';
import { CreateProfileCommand } from '../../application/commands/create-profile.command';

@Controller()
export class CandidateMessageHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(APPLICATION_SUBMITTED)
  async onApplicationSubmitted(
    @Payload() payload: { email: string },
  ): Promise<void> {
    await this.commandBus.execute(new CreateProfileCommand(payload.email));
  }
}
