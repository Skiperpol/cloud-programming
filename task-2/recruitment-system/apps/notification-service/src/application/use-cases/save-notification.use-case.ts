import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Repository } from 'typeorm';
import { Logger } from 'winston';
import { NotificationEntity } from '../../infrastructure/persistence/notification.entity';
import { NotificationStatus } from '../../domain/notification-status.enum';

@Injectable()
export class SaveNotificationUseCase {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async save(email: string, result: string): Promise<void> {
    const message =
      result === 'QUALIFIED'
        ? NotificationStatus.INVITATION
        : NotificationStatus.REJECTION;

    await this.repository.save({ email, message });
    this.logger.info('Final notification event saved', { email, message });
  }

  async findByEmail(email: string): Promise<NotificationEntity | null> {
    return this.repository.findOne({ where: { email } });
  }
}
