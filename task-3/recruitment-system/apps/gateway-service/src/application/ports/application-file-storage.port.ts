import { Readable } from 'node:stream';

export const APPLICATION_FILE_STORAGE_PORT = 'APPLICATION_FILE_STORAGE_PORT';

export class ApplicationFileNotFoundError extends Error {}

export interface ApplicationFileStoragePort {
  upload(
    applicationId: string,
    body: Buffer,
    contentType: string,
  ): Promise<{ objectKey: string }>;
  getReadableStream(objectKey: string): Promise<{
    stream: Readable;
    contentType: string;
    contentLength?: number;
  }>;
}
