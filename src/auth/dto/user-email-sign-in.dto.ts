import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserEmailSignInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  providedId: string;

  @ApiProperty()
  @IsString()
  password: string;
}
