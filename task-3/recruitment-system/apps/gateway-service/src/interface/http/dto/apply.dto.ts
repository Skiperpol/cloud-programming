import { IsEmail, IsNotEmpty } from 'class-validator';

export class ApplyDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
