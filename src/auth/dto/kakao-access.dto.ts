import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class KakaoAccessDto {
  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;
}
