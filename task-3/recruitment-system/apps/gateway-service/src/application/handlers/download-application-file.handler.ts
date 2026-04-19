import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Readable } from 'node:stream';
import { DownloadApplicationFileQuery } from '../queries/download-application-file.query';
import {
  APPLICATION_FILE_STORAGE_PORT,
  ApplicationFileNotFoundError,
} from '../ports/application-file-storage.port';
import type { ApplicationFileStoragePort } from '../ports/application-file-storage.port';
import { APPLICATION_REPOSITORY_PORT } from '../ports/application-repository.port';
import type { ApplicationRepositoryPort } from '../ports/application-repository.port';

export interface DownloadApplicationFileResult {
  stream: Readable;
  contentType: string;
  contentLength?: number;
  downloadFileName: string;
}

@QueryHandler(DownloadApplicationFileQuery)
export class DownloadApplicationFileHandler implements IQueryHandler<
  DownloadApplicationFileQuery,
  DownloadApplicationFileResult
> {
  constructor(
    @Inject(APPLICATION_REPOSITORY_PORT)
    private readonly applicationRepository: ApplicationRepositoryPort,
    @Inject(APPLICATION_FILE_STORAGE_PORT)
    private readonly fileStorage: ApplicationFileStoragePort,
  ) {}

  async execute(
    query: DownloadApplicationFileQuery,
  ): Promise<DownloadApplicationFileResult> {
    const application = await this.applicationRepository.findByApplicationId(
      query.applicationId,
    );
    if (!application) {
      throw new NotFoundException(
        `Application ${query.applicationId} not found`,
      );
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
      const out = await this.fileStorage.getReadableStream(
        application.s3ObjectKey,
      );
      stream = out.stream;
      contentType = out.contentType;
      contentLength = out.contentLength;
    } catch (err) {
      if (err instanceof ApplicationFileNotFoundError) {
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
      contentLength,
    };
  }
}
