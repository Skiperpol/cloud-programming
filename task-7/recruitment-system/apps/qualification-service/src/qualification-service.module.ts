import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../../libs/shared/database/database.config';
import { createTypeOrmConfig } from '../../../libs/shared/database/typeorm.config';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { QualificationDecisionEntity } from './infrastructure/persistence/entities/qualification-decision.entity';
import { EvaluateCandidateHandler } from './application/handlers/evaluate-candidate.handler';
import { ListQualificationDecisionsHandler } from './application/handlers/list-qualification-decisions.handler';
import { QUALIFICATION_DECISION_REPOSITORY_PORT } from './application/ports/qualification-decision-repository.port';
import { QUALIFICATION_JOIN_STORE_PORT } from './application/ports/qualification-join-store.port';
import { QualificationController } from './interface/http/qualification.controller';
import { HealthController } from './interface/http/health.controller';
import { QualificationMessageHandler } from './interface/messaging/qualification.message-handler';
import { QUALIFICATION_EVENT_PUBLISHER } from './application/ports/qualification-event.publisher.port';
import { QualificationLogger } from './infrastructure/logging/qualification.logger';
import { RabbitMqQualificationEventPublisher } from './infrastructure/messaging/rabbitmq-qualification-event.publisher';
import { TypeOrmQualificationDecisionRepositoryAdapter } from './infrastructure/persistence/entities/typeorm-qualification-decision-repository.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appendDbBootLog } from '../../../libs/shared/database/db-boot-log';
import { Redis } from 'ioredis';
import { RedisQualificationJoinStoreAdapter } from './infrastructure/redis/redis-qualification-join-store.adapter';
import { QualificationRedisClient } from './infrastructure/redis/qualification-redis.client';
import { QUALIFICATION_REDIS } from './infrastructure/redis/qualification-redis.token';

@Module({
  imports: [
    CqrsModule,
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    WinstonLoggerModule.forService('qualification-service'),
    TypeOrmModule.forRootAsync(
      createTypeOrmConfig('qualification-service', 'qualification'),
    ),
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
  controllers: [
    QualificationController,
    QualificationMessageHandler,
    HealthController,
  ],
  providers: [
    EvaluateCandidateHandler,
    ListQualificationDecisionsHandler,
    QualificationLogger,
    TypeOrmQualificationDecisionRepositoryAdapter,
    RedisQualificationJoinStoreAdapter,
    {
      provide: QUALIFICATION_REDIS,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Redis> => {
        const redisLog = new Logger('qualification-service:redis');
        redisLog.log('Starting Redis connection');
        appendDbBootLog('qualification-service', 'redis', 'connecting');
        const redisUrl = configService.getOrThrow<string>(
          'database.qualificationJoinStore.url',
        );
        const client = new QualificationRedisClient(redisUrl);
        try {
          await client.ping();
          redisLog.log('Redis connection established');
          appendDbBootLog('qualification-service', 'redis', 'connected');
        } catch (error) {
          redisLog.error('Redis connection failed', error);
          appendDbBootLog(
            'qualification-service',
            'redis',
            'failed',
            error instanceof Error ? error.message : String(error),
          );
          throw error;
        }
        return client;
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
