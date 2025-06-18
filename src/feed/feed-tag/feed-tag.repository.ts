import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedTag } from './feed-tag.entity';

@EntityRepository(FeedTag)
export class FeedTagRepository extends Repository<FeedTag> {
  /**
   * 피드의 태그 조회 (in query)
   * @param feedIds
   */
  async getFeedTagInFeedIds(feedIds: string[]): Promise<FeedTag[]> {
    return await getRepository(FeedTag)
      .createQueryBuilder('feed_tag')
      .where('feed_id IN (:feedIds)', { feedIds })
      .getMany();
  }

  // SELECT name, count(name)
  // from magazine_tag where name_en REGEXP 'DARK[[:space:]]?KNIGHT'
  // group by name
  async findTagList(name: string) {
    return await getRepository(FeedTag)
      .createQueryBuilder('feed_tag')
      .leftJoinAndSelect('feed_tag.feed', 'feed')
      .select('feed_tag.name AS name')
      .addSelect('COUNT(*) AS tagCount')
      .where("REPLACE(feed_tag.name, ' ', '') REGEXP :name", { name: name })
      .andWhere('feed.deleted_at IS NULL')
      .groupBy('feed_tag.name')
      .getRawMany();
  }
}
