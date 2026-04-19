import { IQuery } from '@nestjs/cqrs';
import { Readable } from 'node:stream';

export class DownloadApplicationFileQuery implements IQuery {
  constructor(public readonly applicationId: string) {}
}

export interface DownloadApplicationFileQueryResult {
  stream: Readable;
  contentType: string;
  contentLength?: number;
  downloadFileName: string;
}
