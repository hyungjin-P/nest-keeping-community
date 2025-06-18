import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedComment } from './feed-comment.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(FeedComment)
export class FeedCommentRepository extends Repository<FeedComment> {
  async findCommentPages(
    options: IPaginationOptions,
    feedId: string,
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(FeedComment)
      .createQueryBuilder('feed_comment')
      .leftJoinAndSelect('feed_comment.writer', 'writer')
      .leftJoinAndSelect('writer.picture', 'writerPicture')
      .leftJoinAndSelect('feed_comment.mentions', 'mentions')
      .leftJoinAndSelect('mentions.mentionUser', 'mentionUser')
      .leftJoinAndSelect('mentionUser.picture', 'mentionUserPicture')
      .where(
        'feed_comment.feedId = :feedId AND feed_comment.parentId IS null',
        {
          feedId,
        },
      )
      .orderBy('feed_comment.created_at', 'DESC');

    return await paginate(queryBuilder, options);
  }

  async findSubCommentPage(
    options: IPaginationOptions,
    feedCommentId: string,
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(FeedComment)
      .createQueryBuilder('feed_comment')
      .leftJoinAndSelect('feed_comment.writer', 'writer')
      .leftJoinAndSelect('writer.picture', 'writerPicture')
      .leftJoinAndSelect('feed_comment.mentions', 'mentions')
      .leftJoinAndSelect('mentions.mentionUser', 'mentionUser')
      .leftJoinAndSelect('mentionUser.picture', 'mentionUserPicture')
      .where('feed_comment.parent_id = :feedCommentId', {
        feedCommentId,
      })
      .andWhere('feed_comment.created_at <= :pageDate')
      .orderBy('feed_comment.created_at', 'DESC');

    return await paginate(queryBuilder, options);
  }

  async findAllFeedCommentWithMentionAndLikes(
    feedId: string,
  ): Promise<FeedComment[]> {
    const queryBuilder = getRepository(FeedComment)
      .createQueryBuilder('feed_comment')
      .leftJoinAndSelect('feed_comment.mentions', 'mentions')
      .leftJoinAndSelect('feed_comment.likes', 'likes')
      .where('feed_comment.feed_id = :feedId', {
        feedId,
      });

    return await queryBuilder.getMany();
  }
}
