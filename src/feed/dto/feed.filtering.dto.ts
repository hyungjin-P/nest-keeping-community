import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class FeedFilteringDto {
  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  isIncludeDate: boolean;

  @ApiProperty()
  @IsDate()
  from: Date;

  @ApiProperty()
  @IsDate()
  to: Date;

  @ApiProperty()
  @IsString()
  sortedColumn: string;

  @ApiProperty()
  @IsString()
  sortedDirection: string;
}
