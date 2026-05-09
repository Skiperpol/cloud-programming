export interface QrCodeRecord {
  url: string;
  fileName: string;
  fileExtension: string;
  fileSizeBytes: number;
  expiresAt: Date;
  createdAt: Date;
}
