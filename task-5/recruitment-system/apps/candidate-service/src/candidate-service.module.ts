import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../../../libs/shared/database/database.config';
import { createTypeOrmConfig } from '../../../libs/shared/database/typeorm.config';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { CreateProfileHandler } from './application/handlers/create-profile.handler';
import { ListCandidatesHandler } from './application/handlers/list-candidates.handler';
import { CANDIDATE_READ_PORT } from './application/ports/candidate-read.port';
import { CANDIDATE_REPOSITORY_PORT } from './application/ports/candidate-repository.port';
import { CandidateEntity } from './infrastructure/persistence/candidate.entity';
import { CandidateLogger } from './infrastructure/logging/candidate.logger';
import { TypeOrmCandidateReadAdapter } from './infrastructure/persistence/typeorm-candidate-read.adapter';
import { TypeOrmCandidateRepositoryAdapter } from './infrastructure/persistence/typeorm-candidate-repository.adapter';
import { HealthController } from './interface/http/health.controller';
import { CandidateMessageHandler } from './interface/messaging/candidate.message-handler';
import { CandidateController } from './interface/http/candidate.controller';

@Module({
  imports: [
    CqrsModule,
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    WinstonLoggerModule.forService('candidate-service'),
    TypeOrmModule.forRootAsync(
      createTypeOrmConfig('candidate-service', 'candidate'),
    ),
    TypeOrmModule.forFeature([CandidateEntity]),
  ],
  controllers: [CandidateMessageHandler, CandidateController, HealthController],
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
