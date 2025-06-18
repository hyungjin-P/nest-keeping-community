import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedBookmark } from './feed-bookmark.entity';
import { FeedLike } from '../feed-like/feed-like.entity';

@EntityRepository(FeedBookmark)
export class FeedBookmarkRepository extends Repository<FeedBookmark> {
  async findFeedBookmarkInFeedIdsOfUser(
    feedIds: string[],
    userId: string,
  ): Promise<FeedBookmark[]> {
    return await getRepository(FeedBookmark)
      .createQueryBuilder('feed_bookmark')
      .where(
        'feed_bookmark.feed_id in (:feedIds) and feed_bookmark.user_id = :userId',
        {
          feedIds,
          userId,
        },
      )
      .getMany();
  }

  async findFeedBookmarkInFeedIds(feedIds: string[]): Promise<FeedBookmark[]> {
    return await getRepository(FeedBookmark)
      .createQueryBuilder('feed_bookmark')
      .where('feed_bookmark.feed_id in (:feedIds)', {
        feedIds,
      })
      .getMany();
  }

  async findFeedBookmarkInFeedIdOfUser(
    feedId: string,
    userId: string,
  ): Promise<FeedBookmark[]> {
    return await getRepository(FeedBookmark)
      .createQueryBuilder('feed_bookmark')
      .where(
        'feed_bookmark.feed_id = :feedId and feed_bookmark.user_id = :userId',
        {
          feedId,
          userId,
        },
      )
      .getMany();
  }
}
