export interface IQrCodeGenerationPolicy {
  readonly maxUrlLength: number;
  readonly expirationDays: number;
  readonly fileExtension: string;
  readonly contentType: string;
}
