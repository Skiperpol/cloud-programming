import { IQuery } from '@nestjs/cqrs';
import { NotificationDto } from '../dto/notification.dto';

export class GetNotificationByEmailQuery implements IQuery {
  constructor(public readonly email: string) {}
}

export interface GetNotificationByEmailQueryResult {
  notification: NotificationDto;
}
