import { NoSuchKey } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Readable } from 'node:stream';
import { Repository } from 'typeorm';
import { GatewayApplicationEntity } from '../../infrastructure/persistence/gateway-application.entity';
import { S3ApplicationFileStorage } from '../../infrastructure/storage/s3-application-file.storage';

export interface DownloadApplicationFileResult {
  stream: Readable;
  contentType: string;
  contentLength?: number;
  downloadFileName: string;
}

@Injectable()
export class DownloadApplicationFileUseCase {
  constructor(
    @InjectRepository(GatewayApplicationEntity)
    private readonly gatewayApplicationRepository: Repository<GatewayApplicationEntity>,
    private readonly s3Storage: S3ApplicationFileStorage,
  ) {}

  async execute(applicationId: string): Promise<DownloadApplicationFileResult> {
    const application = await this.gatewayApplicationRepository.findOne({
      where: { applicationId },
    });
    if (!application) {
      throw new NotFoundException(`Application ${applicationId} not found`);
    }
    if (!application.s3ObjectKey) {
      throw new NotFoundException(
        'No file in storage for this application (legacy record)',
      );
    }
    let stream: Readable;
    let contentType: string;
    let contentLength: number | undefined;
    try {
      const out = await this.s3Storage.getReadableStream(
        application.s3ObjectKey,
      );
      stream = out.stream;
      contentType = out.contentType;
      contentLength = out.contentLength;
    } catch (err) {
      if (err instanceof NoSuchKey) {
        throw new NotFoundException('File not found in storage');
      }
      throw err;
    }
    const downloadFileName =
      application.extension.length > 0
        ? `${application.fileName}.${application.extension}`
        : application.fileName;
    return {
      stream,
      contentType,
      downloadFileName,
      ...(contentLength !== undefined ? { contentLength } : {}),
    };
  }
}
