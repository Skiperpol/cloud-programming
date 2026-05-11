import type { QrCodeRecord } from '../entities/qr-code-record.entity';

export interface CreateQrCodeRecordParams {
  url: string;
  fileName: string;
  fileExtension: string;
  fileSizeBytes: number;
  createdAt: Date;
  expirationDays: number;
}

function addUtcDays(base: Date, days: number): Date {
  const next = new Date(base.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function createQrCodeRecord(
  params: CreateQrCodeRecordParams,
): QrCodeRecord {
  return {
    url: params.url,
    fileName: params.fileName,
    fileExtension: params.fileExtension,
    fileSizeBytes: params.fileSizeBytes,
    createdAt: params.createdAt,
    expiresAt: addUtcDays(params.createdAt, params.expirationDays),
  };
}
