import { IsNumber, IsString } from 'class-validator';
import { Feed } from '../feed.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MypageFeedMainDto {
  @ApiProperty()
  @IsString()
  feedList: Feed[];

  @ApiProperty()
  @IsNumber()
  otherCount: number = 0;

  @ApiProperty()
  @IsNumber()
  totalCount: number = 0;
}
