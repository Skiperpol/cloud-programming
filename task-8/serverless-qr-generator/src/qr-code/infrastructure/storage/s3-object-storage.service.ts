import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type {
  IObjectStorage,
  PutPublicObjectParams,
  PutPublicObjectResult,
} from '../../domain/ports/object-storage.port';
import { QrCodeEnvConfig } from '../config/qr-code-env.config';

@Injectable()
export class S3ObjectStorageService implements IObjectStorage {
  private readonly client: S3Client;

  constructor(private readonly config: QrCodeEnvConfig) {
    this.client = new S3Client({});
  }

  async putPublicObject(
    params: PutPublicObjectParams,
  ): Promise<PutPublicObjectResult> {
    if (!this.config.s3BucketName) {
      throw new Error('QR_CODES_BUCKET_NAME nie jest ustawione');
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.s3BucketName,
        Key: params.key,
        Body: params.body,
        ContentType: params.contentType,
      }),
    );

    const encodedKey = params.key
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');

    const publicUrl = `${this.config.publicObjectBaseUrl}/${encodedKey}`;
    return { publicUrl };
  }
}
