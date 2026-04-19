import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { ParsedDocumentEntity } from './infrastructure/persistence/parsed-document.entity';
import { ParseDocumentUseCase } from './application/use-cases/parse-document.use-case';
import { ListParsedDocumentsUseCase } from './application/use-cases/list-parsed-documents.use-case';
import { ParsingMessageHandler } from './interface/messaging/parsing.message-handler';
import { ParsingController } from './interface/http/parsing.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
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
  providers: [ParseDocumentUseCase, ListParsedDocumentsUseCase],
})
export class ParsingServiceModule {}
