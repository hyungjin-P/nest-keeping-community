import { IsString } from 'class-validator';

export class AddCommentLikeDto {
  @IsString()
  feedCommentId: string;

  @IsString()
  userId: string;
}
