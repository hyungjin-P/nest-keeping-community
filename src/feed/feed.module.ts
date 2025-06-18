import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedRepository } from './feed.repository';
import { PublicFeedController } from './public/public.feed.controller';
import { FeedTagRepository } from './feed-tag/feed-tag.repository';
import { FeedPictureRepository } from './feed-picture/feed-picture.repository';
import { FeedLikeRepository } from './feed-like/feed-like.repository';
import { FeedTagService } from './feed-tag/feed-tag.service';
import { FeedLikeService } from './feed-like/feed-like.service';
import { AuthModule } from '../auth/auth.module';
import { FeedCommentRepository } from './feed-comment/feed-comment.repository';
import { FeedBookmarkRepository } from './feed-bookmark/feed-bookmark.repository';
import { FeedBookmarkService } from './feed-bookmark/feed-bookmark.service';
import { FeedCommentService } from './feed-comment/feed-comment.service';
import { FeedPictureService } from './feed-picture/feed-picture.service';
import { FeedCommentController } from './feed-comment/feed-comment.controller';
import { FeedCommentModule } from './feed-comment/feed-comment.module';
import { FeedCommentMentionService } from './feed-comment/comment-mention/comment-mention.service';
import { FeedCommentMentionRepository } from './feed-comment/comment-mention/comment-mention.repository';
import { FeedCommentLikeRepository } from './feed-comment/commnet-like/comment-like.repository';
import { FeedCommentLikeService } from './feed-comment/commnet-like/comment-like.service';
import { FollowService } from '../user/follow/follow.service';
import { FollowRepository } from '../user/follow/follow.repository';
import { FileModule } from '../file/file.module';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { UserPictureRepository } from '../user/user-picture/user-picture.repository';
import { FindFeedRepository } from './feed-dao/find-feed.repository';
import { FeedTopicService } from './feed-topic/feed-topic.service';
import { FeedTopicRepository } from './feed-topic/feed-topic.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedRepository,
      FeedBookmarkRepository,
      FeedCommentRepository,
      FeedCommentMentionRepository,
      FeedCommentLikeRepository,
      FeedLikeRepository,
      FeedPictureRepository,
      FeedTagRepository,
      FeedTopicRepository,
      FollowRepository,
      FindFeedRepository,
      UserRepository,
      UserPictureRepository,
    ]),
    AuthModule,
    FileModule,
    FeedCommentModule,
  ],
  controllers: [FeedController, PublicFeedController, FeedCommentController],
  providers: [
    FeedService,
    FeedBookmarkService,
    FeedCommentService,
    FeedCommentMentionService,
    FeedCommentLikeService,
    FeedLikeService,
    FeedPictureService,
    FeedTagService,
    FollowService,
    UserService,
    FeedTopicService,
  ],
  exports: [FeedService],
})
export class FeedModule {}
