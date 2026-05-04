import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { CheckBlacklistStatusHandler } from './application/handlers/check-blacklist-status.handler';
import { ListBlacklistEntriesHandler } from './application/handlers/list-blacklist-entries.handler';
import { BLACKLIST_READ_PORT } from './application/ports/blacklist-read.port';
import { SAFETY_EVENT_PUBLISHER } from './application/ports/safety-event.publisher.port';
import { VerificationLogger } from './infrastructure/logging/verification.logger';
import { RabbitMqSafetyEventPublisher } from './infrastructure/messaging/rabbitmq-safety-event.publisher';
import { BlacklistEntryEntity } from './infrastructure/persistence/blacklist-entry.entity';
import { TypeOrmBlacklistReadAdapter } from './infrastructure/persistence/typeorm-blacklist-read.adapter';
import { VerificationMessageHandler } from './interface/messaging/verification.message-handler';
import { VerificationController } from './interface/http/verification.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonLoggerModule.forService('verification-service'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.BLACKLIST_DB_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
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
  controllers: [VerificationMessageHandler, VerificationController],
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
