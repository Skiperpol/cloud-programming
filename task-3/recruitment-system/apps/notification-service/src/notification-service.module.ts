import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { NotificationEntity } from './infrastructure/persistence/notification.entity';
import { GetNotificationByEmailHandler } from './application/handlers/get-notification-by-email.handler';
import { ListNotificationsHandler } from './application/handlers/list-notifications.handler';
import { NOTIFICATION_REPOSITORY_PORT } from './application/ports/notification-repository.port';
import { SaveNotificationHandler } from './application/handlers/save-notification.handler';
import { NotificationLogger } from './infrastructure/logging/notification.logger';
import { TypeOrmNotificationRepositoryAdapter } from './infrastructure/persistence/typeorm-notification-repository.adapter';
import { NotificationMessageHandler } from './interface/messaging/notification.message-handler';
import { NotificationController } from './interface/http/notification.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
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
  providers: [
    SaveNotificationHandler,
    ListNotificationsHandler,
    GetNotificationByEmailHandler,
    NotificationLogger,
    TypeOrmNotificationRepositoryAdapter,
    {
      provide: NOTIFICATION_REPOSITORY_PORT,
      useExisting: TypeOrmNotificationRepositoryAdapter,
    },
  ],
})
export class NotificationServiceModule {}
