import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { IQrMetadataRepository } from '../../domain/ports/qr-metadata-repository.port';
import type { QrCodeRecord } from '../../domain/entities/qr-code-record.entity';
import { QrCodeEnvConfig } from '../config/qr-code-env.config';

@Injectable()
export class DynamoDbQrMetadataRepository implements IQrMetadataRepository {
  private readonly docClient: DynamoDBDocumentClient;

  constructor(private readonly config: QrCodeEnvConfig) {
    const raw = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(raw);
  }

  async save(record: QrCodeRecord): Promise<void> {
    if (!this.config.dynamoTableName) {
      throw new Error('QR_CODES_TABLE_NAME nie jest ustawione');
    }

    await this.docClient.send(
      new PutCommand({
        TableName: this.config.dynamoTableName,
        Item: {
          fileName: record.fileName,
          url: record.url,
          fileExtension: record.fileExtension,
          fileSizeBytes: record.fileSizeBytes,
          expiresAt: record.expiresAt.toISOString(),
          createdAt: record.createdAt.toISOString(),
        },
      }),
    );
  }
}
