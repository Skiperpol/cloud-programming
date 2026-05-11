import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import type { IQrGenerator } from '../../domain/ports/qr-generator.interface';
import type { IHashService } from '../../domain/ports/hash-service.interface';
import type { IObjectStorage } from '../../domain/ports/object-storage.port';
import type { IQrMetadataRepository } from '../../domain/ports/qr-metadata-repository.port';
import type { IQrCodeGenerationPolicy } from '../../domain/ports/qr-code-generation-policy.port';
import { InvalidQrSourceUrlError } from '../../domain/errors/invalid-qr-source-url.error';
import { assertValidQrSourceUrl } from '../../domain/validators/qr-source-url.validator';
import {
  HASH_SERVICE,
  OBJECT_STORAGE,
  QR_CODE_GENERATION_POLICY,
  QR_GENERATOR,
  QR_METADATA_REPOSITORY,
} from '../../domain/constants/injection-tokens';
import { createQrCodeRecord } from '../../domain/factories/qr-code-record.factory';

@Injectable()
export class CreateQrCodeUseCase {
  constructor(
    @Inject(QR_GENERATOR)
    private readonly qrGenerator: IQrGenerator,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
    @Inject(OBJECT_STORAGE)
    private readonly objectStorage: IObjectStorage,
    @Inject(QR_METADATA_REPOSITORY)
    private readonly metadataRepository: IQrMetadataRepository,
    @Inject(QR_CODE_GENERATION_POLICY)
    private readonly policy: IQrCodeGenerationPolicy,
  ) {}

  async execute(url: string): Promise<string> {
    try {
      assertValidQrSourceUrl(url, this.policy.maxUrlLength);
    } catch (err) {
      if (err instanceof InvalidQrSourceUrlError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }

    const normalizedUrl = url.trim();
    const urlHash = this.hashService.hash(normalizedUrl);
    const fileExtension = this.policy.fileExtension;
    const contentType = this.policy.contentType;
    const fileName = `${urlHash}.${fileExtension}`;
    const createdAt = new Date();

    const qrBuffer = await this.qrGenerator.generate(normalizedUrl);

    const { publicUrl } = await this.objectStorage.putPublicObject({
      key: fileName,
      body: qrBuffer,
      contentType,
    });

    await this.metadataRepository.save(
      createQrCodeRecord({
        url: normalizedUrl,
        fileName,
        fileExtension,
        fileSizeBytes: qrBuffer.length,
        createdAt,
        expirationDays: this.policy.expirationDays,
      }),
    );

    return publicUrl;
  }
}
