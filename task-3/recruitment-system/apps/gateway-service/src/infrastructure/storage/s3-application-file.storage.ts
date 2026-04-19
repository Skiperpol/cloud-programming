import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'node:stream';

@Injectable()
export class S3ApplicationFileStorage {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.getOrThrow<string>('AWS_S3_BUCKET');
    const region = this.config.get<string>('AWS_REGION') ?? 'eu-central-1';
    const endpoint = this.config.get<string>('AWS_S3_ENDPOINT');
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    const sessionToken = this.config.get<string>('AWS_SESSION_TOKEN');

    this.client = new S3Client({
      region,
      ...(endpoint ? { endpoint } : {}),
      ...(this.config.get<string>('AWS_S3_FORCE_PATH_STYLE') === 'true'
        ? { forcePathStyle: true }
        : {}),
      ...(accessKeyId && secretAccessKey
        ? {
            credentials: {
              accessKeyId,
              secretAccessKey,
              ...(sessionToken ? { sessionToken } : {}),
            },
          }
        : {}),
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
    const objectKey = this.objectKeyForApplication(applicationId);
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
        Body: body,
        ContentType: contentType,
      }),
    );
    return { objectKey };
  }

  async getReadableStream(objectKey: string): Promise<{
    stream: Readable;
    contentType: string;
    contentLength?: number;
  }> {
    const output = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
      }),
    );
    const body = output.Body;
    if (!body) {
      throw new Error('S3 GetObject returned empty body');
    }
    const stream = body as Readable;
    const contentLength = output.ContentLength;
    return {
      stream,
      contentType: output.ContentType ?? 'application/octet-stream',
      ...(typeof contentLength === 'number' ? { contentLength } : {}),
    };
  }
}
