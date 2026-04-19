export const FILE_METADATA_LOGGER_PORT = 'FILE_METADATA_LOGGER_PORT';

export interface FileMetadataLoggerPort {
  logMetadata(
    fileName: string,
    extension: string,
    email: string,
    sizeBytes: number,
    s3ObjectKey: string,
  ): void;
}
