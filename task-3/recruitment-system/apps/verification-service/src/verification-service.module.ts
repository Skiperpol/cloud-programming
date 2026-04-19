import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { BlacklistEntryEntity } from './infrastructure/persistence/blacklist-entry.entity';
import { CheckBlacklistStatusUseCase } from './application/use-cases/check-blacklist-status.use-case';
import { ListBlacklistEntriesUseCase } from './application/use-cases/list-blacklist-entries.use-case';
import { VerificationMessageHandler } from './interface/messaging/verification.message-handler';
import { VerificationController } from './interface/http/verification.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
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
  providers: [CheckBlacklistStatusUseCase, ListBlacklistEntriesUseCase],
})
export class VerificationServiceModule {}
