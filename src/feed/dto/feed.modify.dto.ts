import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FeedModifyDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  picture: string;

  @ApiProperty()
  @IsBoolean()
  posting: boolean;

  @ApiProperty()
  @IsString()
  feedId: string;
}
