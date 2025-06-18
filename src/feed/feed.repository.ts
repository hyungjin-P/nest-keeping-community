import {
  EntityRepository,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Feed } from './feed.entity';
import {
  IPaginationOptions,
  paginate,
  paginateRaw,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FeedPicture } from './feed-picture/feed-picture.entity';
import { FeedLike } from './feed-like/feed-like.entity';
import { FeedComment } from './feed-comment/feed-comment.entity';

@EntityRepository(Feed)
export class FeedRepository extends Repository<Feed> {
  async findFeedPages(options: IPaginationOptions): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Feed)
      .createQueryBuilder('feed')
      .select(
        'feed.id, feed.state, feed.content, feed.picture, feed.created_at',
      )
      .addSelect('writer.nickname', 'writerNickname')
      .addSelect('writer.email', 'writerEmail')
      .addSelect('writer_picture.url', 'writerPictureUrl')
      .leftJoin('user', 'writer', 'writer.id = feed.user_id')
      .leftJoin(
        'user_picture',
        'writer_picture',
        'writer_picture.user_id = writer.id',
      )
      .addSelect((subQuery: SelectQueryBuilder<Number>) => {
        return subQuery
          .select('COUNT(*)', 'pictureCount')
          .from(FeedPicture, 'feed_picture')
          .where('feed_picture.feed_id = feed.id');
      }, 'pictureCount')
      .addSelect((subQuery: SelectQueryBuilder<Number>) => {
        return subQuery
          .select('COUNT(*)', 'likeCount')
          .from(FeedLike, 'feed_like')
          .where('feed_like.feed_id = feed.id');
      }, 'likeCount')
      .addSelect((subQuery: SelectQueryBuilder<Number>) => {
        return subQuery
          .select('COUNT(*)', 'commentCount')
          .from(FeedComment, 'feed_comment')
          .where('feed_comment.feed_id = feed.id');
      }, 'commentCount')
      .where('feed.state = :feedState', { feedState: 'feed_state_posting' })
      .orderBy('feed.created_at', 'DESC');

    return await paginateRaw<any>(queryBuilder, options);
  }

  async findByFeedId(feedId: string): Promise<Feed[]> {
    return await getRepository(Feed)
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.writer', 'user')
      .leftJoinAndSelect('user.picture', 'userPicture')
      .leftJoinAndSelect('feed.pictures', 'feedPicture')
      .leftJoinAndSelect('feed.tags', 'feedTag')
      // .leftJoinAndSelect('feed.likeUsers', 'likeUsers')
      // .leftJoinAndSelect('likeUsers.user', 'likeUser')
      // .leftJoinAndSelect('likeUser.picture', 'likeUserPicture')
      .where('feed.id = :feedId', { feedId: feedId })
      .getMany();
  }

  async findFeedPageByUserIds(
    options: IPaginationOptions,
    userIds: string[],
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Feed)
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.writer', 'user')
      .leftJoinAndSelect('user.picture', 'userPicture')
      .leftJoinAndSelect('feed.pictures', 'feedPicture')
      .leftJoinAndSelect('feed.tags', 'feedTag')
      .where('feed.user_id in (:userIds) and feed.state = :feedState', {
        userIds: userIds,
        feedState: 'feed_state_posting',
      })
      // .groupBy('feed.id')
      .orderBy('feed.created_at', 'DESC');

    return await paginate<Feed>(queryBuilder, options);
  }

  async findFeedPageByFeedIds(
    options: IPaginationOptions,
    feedIds: string[],
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Feed)
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.writer', 'user')
      .leftJoinAndSelect('user.picture', 'userPicture')
      .leftJoinAndSelect('feed.pictures', 'feedPicture')
      .leftJoinAndSelect('feed.tags', 'feedTag')
      .where('feed.id in (:feedIds) and feed.state = :feedState', {
        feedIds: feedIds,
        feedState: 'feed_state_posting',
      })
      // .groupBy('feed.id')
      .orderBy('feed.created_at', 'DESC');

    return await paginate<Feed>(queryBuilder, options);
  }
}
