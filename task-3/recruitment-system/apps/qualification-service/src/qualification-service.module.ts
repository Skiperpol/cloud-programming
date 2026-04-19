import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { QualificationDecisionEntity } from './infrastructure/persistence/entities/qualification-decision.entity';
import { EvaluateCandidateHandler } from './application/handlers/evaluate-candidate.handler';
import { ListQualificationDecisionsHandler } from './application/handlers/list-qualification-decisions.handler';
import { QUALIFICATION_DECISION_REPOSITORY_PORT } from './application/ports/qualification-decision-repository.port';
import { QualificationController } from './interface/http/qualification.controller';
import { QualificationMessageHandler } from './interface/messaging/qualification.message-handler';
import { QUALIFICATION_EVENT_PUBLISHER } from './application/ports/qualification-event.publisher.port';
import { QualificationLogger } from './infrastructure/logging/qualification.logger';
import { RabbitMqQualificationEventPublisher } from './infrastructure/messaging/rabbitmq-qualification-event.publisher';
import { TypeOrmQualificationDecisionRepositoryAdapter } from './infrastructure/persistence/entities/typeorm-qualification-decision-repository.adapter';
import { ConfigModule } from '@nestjs/config';

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
    {
      provide: QUALIFICATION_EVENT_PUBLISHER,
      useClass: RabbitMqQualificationEventPublisher,
    },
    {
      provide: QUALIFICATION_DECISION_REPOSITORY_PORT,
      useExisting: TypeOrmQualificationDecisionRepositoryAdapter,
    },
  ],
})
export class QualificationServiceModule {}
