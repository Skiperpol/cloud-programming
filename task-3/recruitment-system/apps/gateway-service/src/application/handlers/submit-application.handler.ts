import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApplicationSubmittedEvent } from '../../domain/application-submitted.event';
import { ApplicationDto } from '../dto/application.dto';
import {
  SubmitApplicationCommand,
  SubmitApplicationCommandResult,
} from '../commands/submit-application.command';
import * as applicationEventPublisherPort from '../ports/application-event.publisher.port';
import { APPLICATION_FILE_STORAGE_PORT } from '../ports/application-file-storage.port';
import type { ApplicationFileStoragePort } from '../ports/application-file-storage.port';
import { FILE_METADATA_LOGGER_PORT } from '../ports/file-metadata-logger.port';
import type { FileMetadataLoggerPort } from '../ports/file-metadata-logger.port';
import { APPLICATION_REPOSITORY_PORT } from '../ports/application-repository.port';
import type { ApplicationRepositoryPort } from '../ports/application-repository.port';

@CommandHandler(SubmitApplicationCommand)
export class SubmitApplicationHandler implements ICommandHandler<
  SubmitApplicationCommand,
  SubmitApplicationCommandResult
> {
  constructor(
    @Inject(APPLICATION_REPOSITORY_PORT)
    private readonly applicationRepository: ApplicationRepositoryPort,
    @Inject(applicationEventPublisherPort.APPLICATION_EVENT_PUBLISHER)
    private readonly eventPublisher: applicationEventPublisherPort.ApplicationEventPublisherPort,
    @Inject(APPLICATION_FILE_STORAGE_PORT)
    private readonly fileStorage: ApplicationFileStoragePort,
    @Inject(FILE_METADATA_LOGGER_PORT)
    private readonly fileMetadataLogger: FileMetadataLoggerPort,
  ) {}

  async execute(
    command: SubmitApplicationCommand,
  ): Promise<SubmitApplicationCommandResult> {
    const applicationId = crypto.randomUUID();
    const parts = command.originalName.split('.');
    const extension =
      parts.length > 1 ? (parts.at(-1)?.toLowerCase() ?? '') : '';
    const fileName =
      parts.length > 1 ? parts.slice(0, -1).join('.') : command.originalName;

    const { objectKey } = await this.fileStorage.upload(
      applicationId,
      command.fileBuffer,
      command.mimeType,
    );
    const uploadedAt = new Date();

    const application: ApplicationDto = {
      applicationId,
      email: command.email,
      fileName,
      extension,
      sizeBytes: command.sizeBytes,
      uploadedAt,
      s3ObjectKey: objectKey,
    };
    await this.applicationRepository.save(application);
    this.fileMetadataLogger.logMetadata(
      application.fileName,
      application.extension,
      application.email,
      application.sizeBytes,
      application.s3ObjectKey,
    );

    this.eventPublisher.publishApplicationSubmitted(
      new ApplicationSubmittedEvent(command.email, applicationId),
    );

    return {
      applicationId,
      fileName,
      extension,
      s3ObjectKey: objectKey,
      sizeBytes: command.sizeBytes,
    };
  }
}
