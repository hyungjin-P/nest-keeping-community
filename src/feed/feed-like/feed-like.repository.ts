import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedLike } from './feed-like.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(FeedLike)
export class FeedLikeRepository extends Repository<FeedLike> {
  /**
   * 좋아요 조회
   * @param feedIds
   * @param userId
   */
  async findFeedLikeInFeedIdsOfUser(
    feedIds: string[],
    userId: string,
  ): Promise<FeedLike[]> {
    return await getRepository(FeedLike)
      .createQueryBuilder('feed_like')
      .where('feed_id in (:feedIds) and user_id = :userId', {
        feedIds,
        userId,
      })
      .getMany();
  }

  async findFeedLikeIds(feedIds: string[]): Promise<FeedLike[]> {
    return await getRepository(FeedLike)
      .createQueryBuilder('feed_like')
      .where('feed_id in (:feedIds)', {
        feedIds,
      })
      .getMany();
  }

  async findFeedLikeInFeedIdOfUser(
    feedId: string,
    userId: string,
  ): Promise<FeedLike[]> {
    return await getRepository(FeedLike)
      .createQueryBuilder('feed_like')
      .where('feed_id = :feedId and user_id = :userId', {
        feedId,
        userId,
      })
      .getMany();
  }

  async findPages(
    options: IPaginationOptions,
    feedId: string,
  ): Promise<Pagination<FeedLike>> {
    const queryBuilder = await getRepository(FeedLike)
      .createQueryBuilder('feed_like')
      .leftJoinAndSelect('feed_like.user', 'likeUser')
      .leftJoinAndSelect('likeUser.picture', 'likeUserPicture')
      .where('feed_id = :feedId', { feedId })
      .orderBy('feed_like.created_at', 'DESC');
    return await paginate(queryBuilder, options);
  }

  async getFeedLikeUsersOfLimit(feedId: string) {
    return await getRepository(FeedLike)
      .createQueryBuilder('feed_like')
      .leftJoinAndSelect('feed_like.user', 'likeUser')
      .leftJoinAndSelect('likeUser.picture', 'likeUserPicture')
      .limit(4)
      .where('feed_id = :feedId', { feedId })
      .getMany();
  }
}
