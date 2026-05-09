import { Body, Controller, Post } from '@nestjs/common';
import { CreateQrDto } from './dto/create-qr.dto';
import { CreateQrCodeUseCase } from '../../application/use-cases/create-qr-code.use-case';

@Controller('qr-codes')
export class QrCodeController {
  constructor(private readonly createQrCodeUseCase: CreateQrCodeUseCase) {}

  @Post()
  async create(@Body() createQrDto: CreateQrDto) {
    const publicUrl = await this.createQrCodeUseCase.execute(createQrDto.url);

    return {
      url: publicUrl,
      message: 'QR Code generated successfully',
    };
  }
}
