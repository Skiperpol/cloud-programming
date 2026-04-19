import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerModule } from '../../../libs/shared/logging/winston-logger.module';
import { CandidateEntity } from './infrastructure/persistence/candidate.entity';
import { CreateProfileUseCase } from './application/use-cases/create-profile.use-case';
import { ListCandidatesUseCase } from './application/use-cases/list-candidates.use-case';
import { CandidateMessageHandler } from './interface/messaging/candidate.message-handler';
import { CandidateController } from './interface/http/candidate.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
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
  providers: [CreateProfileUseCase, ListCandidatesUseCase],
})
export class CandidateServiceModule {}
