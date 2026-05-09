import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';
import { DEFAULT_QR_SOURCE_URL_MAX_LENGTH } from '../../../domain/constants/url-constraints';

export class CreateQrDto {
  @IsNotEmpty({ message: 'URL nie może być pusty' })
  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
    },
    {
      message:
        'Adres musi być poprawnym URL i zaczynać się od http:// lub https://',
    },
  )
  @MaxLength(DEFAULT_QR_SOURCE_URL_MAX_LENGTH, {
    message: 'Adres URL jest za długi',
  })
  url: string;
}
