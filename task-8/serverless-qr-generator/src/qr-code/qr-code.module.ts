import { Module } from '@nestjs/common';
import { QrCodeController } from './infrastructure/controllers/qr-code.controller';
import { CreateQrCodeUseCase } from './application/use-cases/create-qr-code.use-case';
import { QRCodeGeneratorService } from './infrastructure/services/qrcode-generator.service';
import { NodeCryptoHashService } from './infrastructure/services/node-crypto-hash.service';
import { S3ObjectStorageService } from './infrastructure/storage/s3-object-storage.service';
import { DynamoDbQrMetadataRepository } from './infrastructure/persistence/dynamodb-qr-metadata.repository';
import { QrCodeEnvConfig } from './infrastructure/config/qr-code-env.config';
import {
  HASH_SERVICE,
  OBJECT_STORAGE,
  QR_CODE_GENERATION_POLICY,
  QR_GENERATOR,
  QR_METADATA_REPOSITORY,
} from './domain/constants/injection-tokens';

@Module({
  controllers: [QrCodeController],
  providers: [
    QrCodeEnvConfig,
    {
      provide: QR_CODE_GENERATION_POLICY,
      useExisting: QrCodeEnvConfig,
    },
    CreateQrCodeUseCase,
    { provide: QR_GENERATOR, useExisting: QRCodeGeneratorService },
    { provide: HASH_SERVICE, useExisting: NodeCryptoHashService },
    { provide: OBJECT_STORAGE, useExisting: S3ObjectStorageService },
    {
      provide: QR_METADATA_REPOSITORY,
      useExisting: DynamoDbQrMetadataRepository,
    },
    QRCodeGeneratorService,
    NodeCryptoHashService,
    S3ObjectStorageService,
    DynamoDbQrMetadataRepository,
  ],
})
export class QrCodeModule {}
