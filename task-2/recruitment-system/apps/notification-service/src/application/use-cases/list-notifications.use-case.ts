import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../infrastructure/persistence/notification.entity';

@Injectable()
export class ListNotificationsUseCase {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {}

  execute(): Promise<NotificationEntity[]> {
    return this.repository.find();
  }
}
