import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationStatus } from '../../domain/notification-status.enum';
import { NotificationLogger } from '../../infrastructure/logging/notification.logger';
import { SaveNotificationCommand } from '../commands/save-notification.command';
import { NOTIFICATION_REPOSITORY_PORT } from '../ports/notification-repository.port';
import type { NotificationRepositoryPort } from '../ports/notification-repository.port';

@CommandHandler(SaveNotificationCommand)
export class SaveNotificationHandler implements ICommandHandler<SaveNotificationCommand> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PORT)
    private readonly repository: NotificationRepositoryPort,
    private readonly logger: NotificationLogger,
  ) {}

  async execute(command: SaveNotificationCommand): Promise<void> {
    const message =
      command.result === 'QUALIFIED'
        ? NotificationStatus.INVITATION
        : NotificationStatus.REJECTION;

    await this.repository.save({ email: command.email, message });
    this.logger.finalNotificationSaved(command.email, message);
  }
}
