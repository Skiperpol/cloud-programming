import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { ListParsedDocumentsHandler } from './application/handlers/list-parsed-documents.handler';
import { ParseDocumentHandler } from './application/handlers/parse-document.handler';
import { PARSED_DOCUMENT_READ_PORT } from './application/ports/parsed-document-read.port';
import { PARSED_DOCUMENT_REPOSITORY_PORT } from './application/ports/parsed-document-repository.port';
import { SKILLS_EVENT_PUBLISHER } from './application/ports/skills-event.publisher.port';
import { ParsedDocumentEntity } from './infrastructure/persistence/parsed-document.entity';
import { RabbitMqSkillsEventPublisher } from './infrastructure/messaging/rabbitmq-skills-event.publisher';
import { ParsingLogger } from './infrastructure/logging/parsing.logger';
import { TypeOrmParsedDocumentReadAdapter } from './infrastructure/persistence/typeorm-parsed-document-read.adapter';
import { TypeOrmParsedDocumentRepositoryAdapter } from './infrastructure/persistence/typeorm-parsed-document-repository.adapter';
import { ParsingMessageHandler } from './interface/messaging/parsing.message-handler';
import { ParsingController } from './interface/http/parsing.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonLoggerModule.forService('parsing-service'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.PARSER_DB_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ParsedDocumentEntity]),
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
  controllers: [ParsingMessageHandler, ParsingController],
  providers: [
    ParseDocumentHandler,
    ListParsedDocumentsHandler,
    ParsingLogger,
    {
      provide: SKILLS_EVENT_PUBLISHER,
      useClass: RabbitMqSkillsEventPublisher,
    },
    TypeOrmParsedDocumentReadAdapter,
    TypeOrmParsedDocumentRepositoryAdapter,
    {
      provide: PARSED_DOCUMENT_READ_PORT,
      useExisting: TypeOrmParsedDocumentReadAdapter,
    },
    {
      provide: PARSED_DOCUMENT_REPOSITORY_PORT,
      useExisting: TypeOrmParsedDocumentRepositoryAdapter,
    },
  ],
})
export class ParsingServiceModule {}
