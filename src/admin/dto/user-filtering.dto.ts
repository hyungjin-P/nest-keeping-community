import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class UserFilteringDto {
  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
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

  @ApiProperty()
  @IsBoolean()
  isIncludeAgreement: boolean;

  @ApiProperty()
  @IsBoolean()
  agreementAge: boolean;

  @ApiProperty()
  @IsBoolean()
  agreementPrivacy: boolean;

  @ApiProperty()
  @IsBoolean()
  agreementServiceTerms: boolean;

  @ApiProperty()
  @IsBoolean()
  agreementMarketing: boolean;
}
