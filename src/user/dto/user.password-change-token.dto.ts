import { IsString } from 'class-validator';

export class UserPasswordChangeTokenDto {
  @IsString()
  token: string;
}
