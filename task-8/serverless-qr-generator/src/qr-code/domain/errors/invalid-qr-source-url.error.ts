export class InvalidQrSourceUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidQrSourceUrlError';
  }
}
