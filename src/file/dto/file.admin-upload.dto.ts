import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FileAdminUploadDto {
  @ApiProperty({ enum: ['public.keeping.link', 'storage.keeping.link'] })
  @IsString()
  domainName: string;

  @ApiProperty({ enum: ['/assets/images/topic'] })
  @IsString()
  path: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsString()
  files: any[];
}
