import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationDto } from '../../application/dto/notification.dto';
import { NotificationRepositoryPort } from '../../application/ports/notification-repository.port';
import { NotificationEntity } from './notification.entity';

@Injectable()
export class TypeOrmNotificationRepositoryAdapter
  implements NotificationRepositoryPort
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {}

  async save(notification: Pick<NotificationDto, 'email' | 'message'>): Promise<void> {
    await this.repository.save({
      email: notification.email,
      message: notification.message,
    });
  }

  async findByEmail(email: string): Promise<NotificationDto | null> {
    const entity = await this.repository.findOne({ where: { email } });
    if (!entity) {
      return null;
    }
    return { id: entity.id, email: entity.email, message: entity.message };
  }

  async findAll(): Promise<NotificationDto[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => ({
      id: entity.id,
      email: entity.email,
      message: entity.message,
    }));
  }
}
