import { Test, TestingModule } from '@nestjs/testing';
import { VerificationServiceController } from './verification-service.controller';
import { VerificationServiceService } from './verification-service.service';

describe('VerificationServiceController', () => {
  let verificationServiceController: VerificationServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VerificationServiceController],
      providers: [VerificationServiceService],
    }).compile();

    verificationServiceController = app.get<VerificationServiceController>(VerificationServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(verificationServiceController.getHello()).toBe('Hello World!');
    });
  });
});
