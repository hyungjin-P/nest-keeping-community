import { IsString } from 'class-validator';

export class UserPasswordChangeEmailDto {
  @IsString()
  token: string;

  @IsString()
  password: string;
}
