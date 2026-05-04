import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DECISION_MADE } from '../../../../../libs/shared/events';
import { SaveNotificationCommand } from '../../application/commands/save-notification.command';

@Controller()
export class NotificationMessageHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(DECISION_MADE)
  async onDecisionMade(
    @Payload() payload: { email: string; result: string },
  ): Promise<void> {
    await this.commandBus.execute(
      new SaveNotificationCommand(payload.email, payload.result),
    );
  }
}
