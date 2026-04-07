import { Test, TestingModule } from '@nestjs/testing';
import { CandidateServiceController } from './candidate-service.controller';
import { CandidateServiceService } from './candidate-service.service';

describe('CandidateServiceController', () => {
  let candidateServiceController: CandidateServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CandidateServiceController],
      providers: [CandidateServiceService],
    }).compile();

    candidateServiceController = app.get<CandidateServiceController>(CandidateServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(candidateServiceController.getHello()).toBe('Hello World!');
    });
  });
});
