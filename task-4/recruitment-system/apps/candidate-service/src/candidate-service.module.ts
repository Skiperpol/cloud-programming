import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { CreateProfileHandler } from './application/handlers/create-profile.handler';
import { ListCandidatesHandler } from './application/handlers/list-candidates.handler';
import { CANDIDATE_READ_PORT } from './application/ports/candidate-read.port';
import { CANDIDATE_REPOSITORY_PORT } from './application/ports/candidate-repository.port';
import { CandidateEntity } from './infrastructure/persistence/candidate.entity';
import { CandidateLogger } from './infrastructure/logging/candidate.logger';
import { TypeOrmCandidateReadAdapter } from './infrastructure/persistence/typeorm-candidate-read.adapter';
import { TypeOrmCandidateRepositoryAdapter } from './infrastructure/persistence/typeorm-candidate-repository.adapter';
import { CandidateMessageHandler } from './interface/messaging/candidate.message-handler';
import { CandidateController } from './interface/http/candidate.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    WinstonLoggerModule.forService('candidate-service'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.CANDIDATE_DB_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([CandidateEntity]),
  ],
  controllers: [CandidateMessageHandler, CandidateController],
  providers: [
    CreateProfileHandler,
    ListCandidatesHandler,
    CandidateLogger,
    TypeOrmCandidateReadAdapter,
    TypeOrmCandidateRepositoryAdapter,
    {
      provide: CANDIDATE_READ_PORT,
      useExisting: TypeOrmCandidateReadAdapter,
    },
    {
      provide: CANDIDATE_REPOSITORY_PORT,
      useExisting: TypeOrmCandidateRepositoryAdapter,
    },
  ],
})
export class CandidateServiceModule {}
