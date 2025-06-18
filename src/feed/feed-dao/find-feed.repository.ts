import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FindFeedEntity } from './find-feed.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(FindFeedEntity)
export class FindFeedRepository extends Repository<FindFeedEntity> {
  async findFeedWithRelations(feedId: string): Promise<FindFeedEntity | null> {
    const queryBuilder = getRepository(FindFeedEntity)
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.pictures', 'pictures')
      .leftJoinAndSelect('feed.likes', 'likes')
      .leftJoinAndSelect('feed.tags', 'tags')
      .leftJoinAndSelect('feed.comments', 'comments')
      .loadRelationCountAndMap('feed.pictureCount', 'feed.pictures')
      .loadRelationCountAndMap('feed.likeCount', 'feed.likes')
      .loadRelationCountAndMap('feed.commentCount', 'feed.comments')
      .where('feed.id = :feedId', { feedId });
    return await queryBuilder.getOne();
  }

  async findAllFeedWithRelations(userId: string): Promise<FindFeedEntity[]> {
    const queryBuilder = getRepository(FindFeedEntity)
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.pictures', 'pictures')
      .leftJoinAndSelect('feed.likes', 'likes')
      .leftJoinAndSelect('feed.tags', 'tags')
      .leftJoinAndSelect('feed.comments', 'comments')
      .leftJoinAndSelect('feed.bookmarks', 'bookmarks')
      .leftJoinAndSelect('feed.writer', 'writer')
      .loadRelationCountAndMap('feed.pictureCount', 'feed.pictures')
      .loadRelationCountAndMap('feed.likeCount', 'feed.likes')
      .loadRelationCountAndMap('feed.commentCount', 'feed.comments')
      .loadRelationIdAndMap(
        'feed.userLike',
        'feed.likes',
        'feed_like',
        (queryBuilder) => {
          return queryBuilder.where(`feed_like.user_id = :userId`, { userId });
        },
      )
      .loadRelationIdAndMap(
        'feed.userBookmark',
        'feed.bookmarks',
        'feed_bookmark',
        (queryBuilder) => {
          return queryBuilder.where(`feed_bookmark.user_id = :userId`, {
            userId,
          });
        },
      )
      .where('feed.user_id = :userId', { userId });
    return await queryBuilder.getMany();
  }

  async findPageFeedWithRelations(
    options: IPaginationOptions,
    userId: string,
  ): Promise<Pagination<FindFeedEntity>> {
    const queryBuilder = getRepository(FindFeedEntity)
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.pictures', 'pictures')
      .leftJoinAndSelect('feed.likes', 'likes')
      .leftJoinAndSelect('feed.tags', 'tags')
      .leftJoinAndSelect('feed.comments', 'comments')
      .leftJoinAndSelect('feed.bookmarks', 'bookmarks')
      .leftJoinAndSelect('feed.writer', 'writer')
      .loadRelationCountAndMap('feed.pictureCount', 'feed.pictures')
      .loadRelationCountAndMap('feed.likeCount', 'feed.likes')
      .loadRelationCountAndMap('feed.commentCount', 'feed.comments')
      .loadRelationIdAndMap(
        'feed.userLike',
        'feed.likes',
        'feed_like',
        (queryBuilder) => {
          return queryBuilder.where(`feed_like.user_id = :userId`, { userId });
        },
      )
      .loadRelationIdAndMap(
        'feed.userBookmark',
        'feed.bookmarks',
        'feed_bookmark',
        (queryBuilder) => {
          return queryBuilder.where(`feed_bookmark.user_id = :userId`, {
            userId,
          });
        },
      )
      .where('feed.user_id = :userId and feed.state = :state', {
        userId,
        state: 'feed_state_posting',
      })
      .orderBy('feed.created_at', 'DESC');

    return await paginate<FindFeedEntity>(queryBuilder, options);
  }
}
