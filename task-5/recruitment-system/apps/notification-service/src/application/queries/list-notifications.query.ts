import { IQuery } from '@nestjs/cqrs';
import { NotificationDto } from '../dto/notification.dto';

export class ListNotificationsQuery implements IQuery {}

export interface ListNotificationsQueryResult {
  notifications: NotificationDto[];
}
