import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ default: 'cba1a1c5-eefa-4926-ba04-1331d3659c14' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: ['public.keeping.link', 'storage.keeping.link'] })
  @IsString()
  domainName: string;

  @ApiProperty({
    default: '/temp/magazine',
  })
  @IsString()
  path: string;

  @ApiProperty({
    enum: ['feed', 'user-picture', 'user-background', 'magazine'],
  })
  @IsString()
  tag: string;

  @ApiProperty({ description: 'tag table id' })
  @IsString()
  tagInId: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsString()
  files: any[];
}
