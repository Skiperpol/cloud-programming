import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../../libs/shared/database/database.config';
import { createTypeOrmConfig } from '../../../libs/shared/database/typeorm.config';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { CheckBlacklistStatusHandler } from './application/handlers/check-blacklist-status.handler';
import { ListBlacklistEntriesHandler } from './application/handlers/list-blacklist-entries.handler';
import { BLACKLIST_READ_PORT } from './application/ports/blacklist-read.port';
import { SAFETY_EVENT_PUBLISHER } from './application/ports/safety-event.publisher.port';
import { VerificationLogger } from './infrastructure/logging/verification.logger';
import { RabbitMqSafetyEventPublisher } from './infrastructure/messaging/rabbitmq-safety-event.publisher';
import { BlacklistEntryEntity } from './infrastructure/persistence/blacklist-entry.entity';
import { TypeOrmBlacklistReadAdapter } from './infrastructure/persistence/typeorm-blacklist-read.adapter';
import { HealthController } from './interface/http/health.controller';
import { VerificationMessageHandler } from './interface/messaging/verification.message-handler';
import { VerificationController } from './interface/http/verification.controller';

@Module({
  imports: [
    CqrsModule,
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    WinstonLoggerModule.forService('verification-service'),
    TypeOrmModule.forRootAsync(
      createTypeOrmConfig('verification-service', 'verification'),
    ),
    TypeOrmModule.forFeature([BlacklistEntryEntity]),
    ClientsModule.register([
      {
        name: 'QUALIFICATION_BUS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.QUALIFICATION_QUEUE ?? 'qualification.events',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [
    VerificationMessageHandler,
    VerificationController,
    HealthController,
  ],
  providers: [
    CheckBlacklistStatusHandler,
    ListBlacklistEntriesHandler,
    VerificationLogger,
    {
      provide: SAFETY_EVENT_PUBLISHER,
      useClass: RabbitMqSafetyEventPublisher,
    },
    TypeOrmBlacklistReadAdapter,
    {
      provide: BLACKLIST_READ_PORT,
      useExisting: TypeOrmBlacklistReadAdapter,
    },
  ],
})
export class VerificationServiceModule {}
