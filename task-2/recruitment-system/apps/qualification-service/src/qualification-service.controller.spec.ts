import { Test, TestingModule } from '@nestjs/testing';
import { QualificationServiceController } from './qualification-service.controller';
import { QualificationServiceService } from './qualification-service.service';

describe('QualificationServiceController', () => {
  let qualificationServiceController: QualificationServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QualificationServiceController],
      providers: [QualificationServiceService],
    }).compile();

    qualificationServiceController = app.get<QualificationServiceController>(QualificationServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(qualificationServiceController.getHello()).toBe('Hello World!');
    });
  });
});
