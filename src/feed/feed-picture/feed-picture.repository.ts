import { EntityRepository, getRepository, Repository } from 'typeorm';
import { FeedPicture } from './feed-picture.entity';
import { FeedBookmark } from '../feed-bookmark/feed-bookmark.entity';

@EntityRepository(FeedPicture)
export class FeedPictureRepository extends Repository<FeedPicture> {
  async findFeedPictureInFeedIds(feedIds: string[]): Promise<FeedPicture[]> {
    return await getRepository(FeedPicture)
      .createQueryBuilder('feed_picture')
      .where('feed_id in (:feedIds)', {
        feedIds,
      })
      .getMany();
  }
}
