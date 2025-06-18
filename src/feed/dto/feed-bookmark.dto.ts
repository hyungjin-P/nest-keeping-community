import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FeedBookmarkDto {
  @ApiProperty()
  @IsString()
  feedId: string;
  @ApiProperty()
  @IsString()
  userId: string;
}
