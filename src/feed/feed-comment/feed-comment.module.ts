import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedCommentRepository } from './feed-comment.repository';
import { FeedCommentController } from './feed-comment.controller';
import { FeedCommentService } from './feed-comment.service';
import { AuthModule } from '../../auth/auth.module';
import { FeedCommentMentionService } from './comment-mention/comment-mention.service';
import { FeedCommentMentionRepository } from './comment-mention/comment-mention.repository';
import { FeedCommentLikeService } from './commnet-like/comment-like.service';
import { FeedCommentLikeRepository } from './commnet-like/comment-like.repository';
import { UserRepository } from '../../user/user.repository';
import { UserService } from '../../user/user.service';
import { UserPictureRepository } from '../../user/user-picture/user-picture.repository';
import { UserBackgroundRepository } from '../../user/user-background/user-background.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedCommentRepository,
      FeedCommentMentionRepository,
      FeedCommentLikeRepository,
      UserRepository,
      UserPictureRepository,
      UserBackgroundRepository,
    ]),
    AuthModule,
  ],
  controllers: [FeedCommentController],
  providers: [
    FeedCommentService,
    FeedCommentMentionService,
    FeedCommentLikeService,
    UserService,
  ],
  exports: [
    FeedCommentService,
    FeedCommentMentionService,
    FeedCommentLikeService,
  ],
})
export class FeedCommentModule {}
