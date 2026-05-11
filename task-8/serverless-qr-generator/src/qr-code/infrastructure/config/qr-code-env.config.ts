import { Injectable } from '@nestjs/common';
import { DEFAULT_QR_SOURCE_URL_MAX_LENGTH } from '../../domain/constants/url-constraints';
import type { IQrCodeGenerationPolicy } from '../../domain/ports/qr-code-generation-policy.port';

@Injectable()
export class QrCodeEnvConfig implements IQrCodeGenerationPolicy {
  readonly maxUrlLength = Number(
    process.env.QR_CODE_MAX_URL_LENGTH ?? DEFAULT_QR_SOURCE_URL_MAX_LENGTH,
  );
  readonly expirationDays = Number(process.env.QR_CODE_EXPIRATION_DAYS ?? 90);
  readonly fileExtension = String(
    process.env.QR_CODE_FILE_EXTENSION?.trim() || 'png',
  );
  readonly contentType = String(
    process.env.QR_CODE_CONTENT_TYPE?.trim() || 'image/png',
  );
  readonly s3BucketName = process.env.QR_CODES_BUCKET_NAME ?? '';
  readonly dynamoTableName = process.env.QR_CODES_TABLE_NAME ?? '';
  readonly awsRegion =
    process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? 'eu-central-1';

  get publicObjectBaseUrl(): string {
    const explicit = process.env.QR_CODES_PUBLIC_BASE_URL?.trim();
    if (explicit) {
      return explicit.replace(/\/+$/, '');
    }
    return `https://${this.s3BucketName}.s3.${this.awsRegion}.amazonaws.com`;
  }
}
