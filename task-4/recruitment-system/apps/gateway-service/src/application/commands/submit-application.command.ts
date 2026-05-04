import { ICommand } from '@nestjs/cqrs';

export class SubmitApplicationCommand implements ICommand {
  constructor(
    public readonly email: string,
    public readonly originalName: string,
    public readonly fileBuffer: Buffer,
    public readonly mimeType: string,
    public readonly sizeBytes: number,
  ) {}
}

export interface SubmitApplicationCommandResult {
  applicationId: string;
  fileName: string;
  extension: string;
  s3ObjectKey: string;
  sizeBytes: number;
}
