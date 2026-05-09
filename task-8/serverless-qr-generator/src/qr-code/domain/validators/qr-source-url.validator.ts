import { InvalidQrSourceUrlError } from '../errors/invalid-qr-source-url.error';

export function assertValidQrSourceUrl(url: string, maxLength: number): void {
  if (!url?.trim()) {
    throw new InvalidQrSourceUrlError('URL nie może być pusty');
  }

  if (url.length > maxLength) {
    throw new InvalidQrSourceUrlError(
      `URL nie może przekraczać ${maxLength} znaków`,
    );
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error();
    }
  } catch {
    throw new InvalidQrSourceUrlError(
      'Adres musi być poprawnym URL (http/https)',
    );
  }
}
