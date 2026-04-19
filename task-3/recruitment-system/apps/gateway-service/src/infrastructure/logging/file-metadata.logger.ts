import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { FileMetadataLoggerPort } from '../../application/ports/file-metadata-logger.port';

@Injectable()
export class FileMetadataLogger implements FileMetadataLoggerPort {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  logMetadata(
    fileName: string,
    extension: string,
    email: string,
    sizeBytes: number,
    s3ObjectKey: string,
  ): void {
    this.logger.info('Received recruitment application file metadata', {
      fileName,
      extension,
      email,
      sizeBytes,
      s3ObjectKey,
    });
  }
}
