import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { DownloadApplicationFileHandler } from './application/handlers/download-application-file.handler';
import { ListApplicationsHandler } from './application/handlers/list-applications.handler';
import { SubmitApplicationHandler } from './application/handlers/submit-application.handler';
import { APPLICATION_EVENT_PUBLISHER } from './application/ports/application-event.publisher.port';
import { APPLICATION_FILE_STORAGE_PORT } from './application/ports/application-file-storage.port';
import { APPLICATION_READ_PORT } from './application/ports/application-read.port';
import { APPLICATION_REPOSITORY_PORT } from './application/ports/application-repository.port';
import { FILE_METADATA_LOGGER_PORT } from './application/ports/file-metadata-logger.port';
import { FileMetadataLogger } from './infrastructure/logging/file-metadata.logger';
import { RabbitMqApplicationEventPublisher } from './infrastructure/messaging/rabbitmq-application-event.publisher';
import { GatewayApplicationEntity } from './infrastructure/persistence/gateway-application.entity';
import { TypeOrmApplicationReadAdapter } from './infrastructure/persistence/typeorm-application-read.adapter';
import { TypeOrmApplicationRepositoryAdapter } from './infrastructure/persistence/typeorm-application-repository.adapter';
import { S3ApplicationFileStorage } from './infrastructure/storage/s3-application-file.storage';
import { RecruitmentController } from './interface/http/recruitment.controller';

@Module({
  imports: [
    CqrsModule,
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
    SubmitApplicationHandler,
    ListApplicationsHandler,
    DownloadApplicationFileHandler,
    {
      provide: APPLICATION_EVENT_PUBLISHER,
      useClass: RabbitMqApplicationEventPublisher,
    },
    {
      provide: APPLICATION_READ_PORT,
      useClass: TypeOrmApplicationReadAdapter,
    },
    {
      provide: APPLICATION_REPOSITORY_PORT,
      useClass: TypeOrmApplicationRepositoryAdapter,
    },
    {
      provide: APPLICATION_FILE_STORAGE_PORT,
      useClass: S3ApplicationFileStorage,
    },
    {
      provide: FILE_METADATA_LOGGER_PORT,
      useClass: FileMetadataLogger,
    },
  ],
})
export class GatewayServiceModule {}
