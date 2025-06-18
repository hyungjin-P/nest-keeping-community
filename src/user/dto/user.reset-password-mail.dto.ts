import { IsEmail, IsString } from 'class-validator';

export class UserResetPasswordMailDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  lang: string;
}
