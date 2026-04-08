import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { QualificationDecisionEntity } from './infrastructure/persistence/entities/qualification-decision.entity';
import { EvaluateCandidateUseCase } from './application/use-cases/evaluate-candidate.use-case';
import { ListQualificationDecisionsUseCase } from './application/use-cases/list-qualification-decisions.use-case';
import { QualificationController } from './interface/http/qualification.controller';
import { QualificationMessageHandler } from './interface/messaging/qualification.message-handler';
import { QUALIFICATION_EVENT_PUBLISHER } from './application/ports/qualification-event.publisher.port';
import { RabbitMqQualificationEventPublisher } from './infrastructure/messaging/rabbitmq-qualification-event.publisher';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
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
    EvaluateCandidateUseCase,
    ListQualificationDecisionsUseCase,
    {
      provide: QUALIFICATION_EVENT_PUBLISHER,
      useClass: RabbitMqQualificationEventPublisher,
    },
  ],
})
export class QualificationServiceModule {}
