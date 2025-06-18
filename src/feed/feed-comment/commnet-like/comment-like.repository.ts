import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedCommentLike } from './commnet-like.entity';

@EntityRepository(FeedCommentLike)
export class FeedCommentLikeRepository extends Repository<FeedCommentLike> {
  async findCommentLikeInCommentIdsOfUser(
    commentIds: string[],
    userId: string,
  ) {
    return await getRepository(FeedCommentLike)
      .createQueryBuilder('feed_comment_like')
      .where('feed_comment_id in (:commentIds) and user_id = :userId', {
        commentIds,
        userId,
      })
      .getMany();
  }

  async findFeedCommentInFeedCommentIds(
    commentIds: string[],
  ): Promise<FeedCommentLike[]> {
    return await getRepository(FeedCommentLike)
      .createQueryBuilder('feed_comment_like')
      .where('feed_comment_like.feed_comment_id in (:commentIds)', {
        commentIds,
      })
      .getMany();
  }
}
