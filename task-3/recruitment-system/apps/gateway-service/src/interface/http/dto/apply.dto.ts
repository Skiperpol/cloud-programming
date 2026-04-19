import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ApplyDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class ApplyResponseDto {
  @IsString()
  @IsNotEmpty()
  applicationId!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;
}
