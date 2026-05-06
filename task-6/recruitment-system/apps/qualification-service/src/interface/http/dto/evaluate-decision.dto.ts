import { IsArray, IsBoolean, IsEmail, IsString } from 'class-validator';

export class EvaluateDecisionDto {
  @IsEmail()
  email!: string;

  @IsBoolean()
  safetyVerified!: boolean;

  @IsArray()
  @IsString({ each: true })
  skillsReady!: string[];
}
