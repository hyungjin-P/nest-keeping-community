import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserModifyServiceTermDto {
  @ApiProperty({
    example: 'bb4fdcad-bf56-4dec-9b93-112e3a844332',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  agreementAge: boolean;

  @ApiProperty()
  @IsNotEmpty()
  agreementPrivacy: boolean;

  @ApiProperty()
  @IsNotEmpty()
  agreementServiceTerms: boolean;

  @ApiProperty()
  @IsNotEmpty()
  agreementMarketing: boolean;
}
