import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { NotificationEntity } from './infrastructure/persistence/notification.entity';
import { ListNotificationsUseCase } from './application/use-cases/list-notifications.use-case';
import { SaveNotificationUseCase } from './application/use-cases/save-notification.use-case';
import { NotificationMessageHandler } from './interface/messaging/notification.message-handler';
import { NotificationController } from './interface/http/notification.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonLoggerModule.forService('notification-service'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.NOTIFICATION_DB_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [NotificationMessageHandler, NotificationController],
  providers: [SaveNotificationUseCase, ListNotificationsUseCase],
})
export class NotificationServiceModule {}
