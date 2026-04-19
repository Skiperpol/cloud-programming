import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'node:stream';
import {
  ApplicationFileNotFoundError,
  ApplicationFileStoragePort,
} from '../../application/ports/application-file-storage.port';

@Injectable()
export class S3ApplicationFileStorage implements ApplicationFileStoragePort {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    this.bucket = config.getOrThrow('AWS_S3_BUCKET');
    this.client = new S3Client({
      region: config.get('AWS_REGION'),
      endpoint: config.get('AWS_S3_ENDPOINT'),
      forcePathStyle: config.get('AWS_S3_FORCE_PATH_STYLE') === 'true',
    });
  }

  objectKeyForApplication(applicationId: string): string {
    return `applications/${applicationId}/document`;
  }

  async upload(
    applicationId: string,
    body: Buffer,
    contentType: string,
  ): Promise<{ objectKey: string }> {
    const Key = `applications/${applicationId}/document`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key,
        Body: body,
        ContentType: contentType,
      }),
    );
    return { objectKey: Key };
  }

  async getReadableStream(objectKey: string): Promise<{
    stream: Readable;
    contentType: string;
    contentLength?: number;
  }> {
    let Body: unknown;
    let ContentType: string | undefined;
    let ContentLength: number | undefined;
    try {
      const output = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: objectKey }),
      );
      Body = output.Body;
      ContentType = output.ContentType;
      ContentLength = output.ContentLength;
    } catch (error) {
      if (error instanceof NoSuchKey) {
        throw new ApplicationFileNotFoundError('File not found in storage');
      }
      throw error;
    }

    if (!(Body instanceof Readable)) {
      throw new InternalServerErrorException(
        'S3 Body is not a readable stream',
      );
    }

    return {
      stream: Body,
      contentType: ContentType ?? 'application/octet-stream',
      contentLength: ContentLength,
    };
  }
}
