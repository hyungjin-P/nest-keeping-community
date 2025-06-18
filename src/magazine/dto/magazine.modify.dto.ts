import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class MagazineModifyDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsBoolean()
  posting: boolean;
}
