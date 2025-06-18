import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedCommentMention } from './comment-mention.entity';

@EntityRepository(FeedCommentMention)
export class FeedCommentMentionRepository extends Repository<FeedCommentMention> {
  async FeedCommentMentionInFeedCommentIds(
    commentIds: string[],
  ): Promise<FeedCommentMention[]> {
    return await getRepository(FeedCommentMention)
      .createQueryBuilder('feed_comment_mention')
      .where('feed_comment_mention.feedCommentId in (:commentIds)', {
        commentIds,
      })
      .getMany();
  }
}
