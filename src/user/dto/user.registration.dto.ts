import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UserRegistrationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  providedId: string;

  @IsNumber()
  verificationCode: number;

  @IsString()
  password: string;

  @IsBoolean()
  agreementAge: boolean;

  @IsBoolean()
  agreementPrivacy: boolean;

  @IsBoolean()
  agreementServiceTerms: boolean;

  @IsBoolean()
  agreementMarketing: boolean;
}
