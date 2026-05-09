import type { QrCodeRecord } from '../entities/qr-code-record.entity';

export interface IQrMetadataRepository {
  save(record: QrCodeRecord): Promise<void>;
}
