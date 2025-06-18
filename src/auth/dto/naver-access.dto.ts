import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NaverAccessDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;
}
