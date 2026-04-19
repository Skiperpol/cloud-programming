import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { DownloadApplicationFileUseCase } from './application/use-cases/download-application-file.use-case';
import { ListApplicationsUseCase } from './application/use-cases/list-applications.use-case';
import { SubmitApplicationUseCase } from './application/use-cases/submit-application.use-case';
import { APPLICATION_EVENT_PUBLISHER } from './application/ports/application-event.publisher.port';
import { FileMetadataLogger } from './infrastructure/logging/file-metadata.logger';
import { RabbitMqApplicationEventPublisher } from './infrastructure/messaging/rabbitmq-application-event.publisher';
import { GatewayApplicationEntity } from './infrastructure/persistence/gateway-application.entity';
import { S3ApplicationFileStorage } from './infrastructure/storage/s3-application-file.storage';
import { RecruitmentController } from './interface/http/recruitment.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonLoggerModule.forService('gateway-service'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.GATEWAY_DB_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([GatewayApplicationEntity]),
    ClientsModule.register([
      {
        name: 'CANDIDATE_BUS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.CANDIDATE_QUEUE ?? 'candidate.events',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'PARSER_BUS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.PARSER_QUEUE ?? 'parser.events',
          queueOptions: { durable: true },
        },
      },
      {
        name: 'VERIFICATION_BUS',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.VERIFICATION_QUEUE ?? 'verification.events',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [RecruitmentController],
  providers: [
    S3ApplicationFileStorage,
    SubmitApplicationUseCase,
    ListApplicationsUseCase,
    DownloadApplicationFileUseCase,
    FileMetadataLogger,
    {
      provide: APPLICATION_EVENT_PUBLISHER,
      useClass: RabbitMqApplicationEventPublisher,
    },
  ],
})
export class GatewayServiceModule {}
