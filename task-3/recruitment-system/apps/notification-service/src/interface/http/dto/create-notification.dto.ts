import { IsEmail, IsIn } from 'class-validator';

export class CreateNotificationDto {
  @IsEmail()
  email!: string;

  @IsIn(['QUALIFIED', 'ACCEPTED', 'REJECTED', 'BLACKLISTED'])
  result!: string;
}
