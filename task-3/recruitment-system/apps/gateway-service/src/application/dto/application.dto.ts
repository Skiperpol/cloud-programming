export interface ApplicationDto {
  applicationId: string;
  email: string;
  fileName: string;
  extension: string;
  sizeBytes: number;
  uploadedAt: Date;
  s3ObjectKey: string;
}
