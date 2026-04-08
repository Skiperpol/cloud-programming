import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class FileMetadataLogger {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  logMetadata(fileName: string, extension: string, email: string): void {
    this.logger.info('Received recruitment application file metadata', {
      fileName,
      extension,
      email,
    });
  }
}
