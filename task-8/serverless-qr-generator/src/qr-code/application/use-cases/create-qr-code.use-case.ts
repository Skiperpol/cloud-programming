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

const PNG_EXTENSION = 'png';
const PNG_CONTENT_TYPE = 'image/png';

function addUtcDays(base: Date, days: number): Date {
  const next = new Date(base.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

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
    const fileName = `${urlHash}.${PNG_EXTENSION}`;
    const createdAt = new Date();
    const expiresAt = addUtcDays(createdAt, this.policy.expirationDays);

    const qrBuffer = await this.qrGenerator.generate(normalizedUrl);

    const { publicUrl } = await this.objectStorage.putPublicObject({
      key: fileName,
      body: qrBuffer,
      contentType: PNG_CONTENT_TYPE,
    });

    await this.metadataRepository.save({
      url: normalizedUrl,
      fileName,
      fileExtension: PNG_EXTENSION,
      fileSizeBytes: qrBuffer.length,
      expiresAt,
      createdAt,
    });

    return publicUrl;
  }
}
