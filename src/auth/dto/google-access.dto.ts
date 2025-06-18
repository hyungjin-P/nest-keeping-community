import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleAccessDto {
  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;
}
