import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { IQrGenerator } from '../../domain/ports/qr-generator.interface';

@Injectable()
export class QRCodeGeneratorService implements IQrGenerator {
  async generate(data: string): Promise<Buffer> {
    return QRCode.toBuffer(data);
  }
}
