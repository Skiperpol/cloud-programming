import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_REPOSITORY_PORT } from '../ports/notification-repository.port';
import type { NotificationRepositoryPort } from '../ports/notification-repository.port';
import {
  ListNotificationsQuery,
  ListNotificationsQueryResult,
} from '../queries/list-notifications.query';

@QueryHandler(ListNotificationsQuery)
export class ListNotificationsHandler implements IQueryHandler<
  ListNotificationsQuery,
  ListNotificationsQueryResult
> {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY_PORT)
    private readonly repository: NotificationRepositoryPort,
  ) {}

  async execute(): Promise<ListNotificationsQueryResult> {
    const notifications = await this.repository.findAll();
    return { notifications };
  }
}
