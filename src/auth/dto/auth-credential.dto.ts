import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  provider: string;

  providedId: string;

  @IsEmail()
  email: string;

  emailVerificationCode: string;

  @IsString()
  password: string;
}
