import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FeedLikeDto {
  @ApiProperty()
  @IsString()
  feedId: string;
  @ApiProperty()
  @IsString()
  userId: string;
}
