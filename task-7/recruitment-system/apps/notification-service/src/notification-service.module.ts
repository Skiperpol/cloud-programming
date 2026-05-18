import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../../libs/shared/database/database.config';
import { createTypeOrmConfig } from '../../../libs/shared/database/typeorm.config';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { NotificationEntity } from './infrastructure/persistence/notification.entity';
import { GetNotificationByEmailHandler } from './application/handlers/get-notification-by-email.handler';
import { ListNotificationsHandler } from './application/handlers/list-notifications.handler';
import { NOTIFICATION_REPOSITORY_PORT } from './application/ports/notification-repository.port';
import { SaveNotificationHandler } from './application/handlers/save-notification.handler';
import { NotificationLogger } from './infrastructure/logging/notification.logger';
import { TypeOrmNotificationRepositoryAdapter } from './infrastructure/persistence/typeorm-notification-repository.adapter';
import { HealthController } from './interface/http/health.controller';
import { NotificationMessageHandler } from './interface/messaging/notification.message-handler';
import { NotificationController } from './interface/http/notification.controller';

@Module({
  imports: [
    CqrsModule,
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    WinstonLoggerModule.forService('notification-service'),
    TypeOrmModule.forRootAsync(
      createTypeOrmConfig('notification-service', 'notification'),
    ),
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [
    NotificationMessageHandler,
    NotificationController,
    HealthController,
  ],
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
