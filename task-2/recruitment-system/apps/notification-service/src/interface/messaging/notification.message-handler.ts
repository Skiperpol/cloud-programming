import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DECISION_MADE } from '../../../../../libs/shared/events';
import { SaveNotificationUseCase } from '../../application/use-cases/save-notification.use-case';

@Controller()
export class NotificationMessageHandler {
  constructor(private readonly saveNotificationUseCase: SaveNotificationUseCase) {}

  @EventPattern(DECISION_MADE)
  async onDecisionMade(
    @Payload() payload: { email: string; result: string },
  ): Promise<void> {
    await this.saveNotificationUseCase.save(payload.email, payload.result);
  }
}
