import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NotificationDto } from '../dto/notification.dto';
import { NOTIFICATION_REPOSITORY_PORT } from '../ports/notification-repository.port';
import type { NotificationRepositoryPort } from '../ports/notification-repository.port';
import { GetNotificationByEmailQuery } from '../queries/get-notification-by-email.query';

@QueryHandler(GetNotificationByEmailQuery)
export class GetNotificationByEmailHandler implements IQueryHandler<
  GetNotificationByEmailQuery,
  NotificationDto | null
> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PORT)
    private readonly repository: NotificationRepositoryPort,
  ) {}

  execute(query: GetNotificationByEmailQuery): Promise<NotificationDto | null> {
    return this.repository.findByEmail(query.email);
  }
}
