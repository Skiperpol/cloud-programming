import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { QualificationDecisionEntity } from './infrastructure/persistence/entities/qualification-decision.entity';
import { EvaluateCandidateHandler } from './application/handlers/evaluate-candidate.handler';
import { ListQualificationDecisionsHandler } from './application/handlers/list-qualification-decisions.handler';
import { QUALIFICATION_DECISION_REPOSITORY_PORT } from './application/ports/qualification-decision-repository.port';
import { QUALIFICATION_JOIN_STORE_PORT } from './application/ports/qualification-join-store.port';
import { QualificationController } from './interface/http/qualification.controller';
import { QualificationMessageHandler } from './interface/messaging/qualification.message-handler';
import { QUALIFICATION_EVENT_PUBLISHER } from './application/ports/qualification-event.publisher.port';
import { QualificationLogger } from './infrastructure/logging/qualification.logger';
import { RabbitMqQualificationEventPublisher } from './infrastructure/messaging/rabbitmq-qualification-event.publisher';
import { TypeOrmQualificationDecisionRepositoryAdapter } from './infrastructure/persistence/entities/typeorm-qualification-decision-repository.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisQualificationJoinStoreAdapter } from './infrastructure/redis/redis-qualification-join-store.adapter';
import { QualificationRedisClient } from './infrastructure/redis/qualification-redis.client';
import { QUALIFICATION_REDIS } from './infrastructure/redis/qualification-redis.token';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonLoggerModule.forService('qualification-service'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.QUALIFICATION_DB_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([QualificationDecisionEntity]),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_BUS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.NOTIFICATION_QUEUE ?? 'notification.events',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [QualificationController, QualificationMessageHandler],
  providers: [
    EvaluateCandidateHandler,
    ListQualificationDecisionsHandler,
    QualificationLogger,
    TypeOrmQualificationDecisionRepositoryAdapter,
    RedisQualificationJoinStoreAdapter,
    {
      provide: QUALIFICATION_REDIS,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Redis => {
        const redisUrl = configService.getOrThrow<string>(
          'QUALIFICATION_REDIS_URL',
        );
        return new QualificationRedisClient(redisUrl);
      },
    },
    {
      provide: QUALIFICATION_EVENT_PUBLISHER,
      useClass: RabbitMqQualificationEventPublisher,
    },
    {
      provide: QUALIFICATION_DECISION_REPOSITORY_PORT,
      useExisting: TypeOrmQualificationDecisionRepositoryAdapter,
    },
    {
      provide: QUALIFICATION_JOIN_STORE_PORT,
      useExisting: RedisQualificationJoinStoreAdapter,
    },
  ],
})
export class QualificationServiceModule {}
