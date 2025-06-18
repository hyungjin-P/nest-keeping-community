import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FileDeleteDto {
  @ApiProperty({
    enum: ['feed', 'user-picture', 'user-background', 'magazine'],
  })
  @IsString()
  tag: string;

  @ApiProperty({ description: 'tag table id' })
  @IsString()
  tagInId: string;

  @ApiProperty()
  @IsString()
  url: string;
}
