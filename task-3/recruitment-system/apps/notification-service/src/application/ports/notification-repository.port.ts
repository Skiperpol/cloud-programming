import { NotificationDto } from '../dto/notification.dto';

export const NOTIFICATION_REPOSITORY_PORT = 'NOTIFICATION_REPOSITORY_PORT';

export interface NotificationRepositoryPort {
  save(notification: Pick<NotificationDto, 'email' | 'message'>): Promise<void>;
  findByEmail(email: string): Promise<NotificationDto | null>;
  findAll(): Promise<NotificationDto[]>;
}
