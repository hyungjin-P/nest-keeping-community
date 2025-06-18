import { Injectable } from '@nestjs/common';
import { FeedTag } from './feed-tag.entity';
import { FeedTagRepository } from './feed-tag.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { IsNull, LessThanOrEqual } from 'typeorm';

@Injectable()
export class FeedTagService {
  constructor(
    @InjectRepository(FeedTagRepository)
    private feedTagRepository: FeedTagRepository,
  ) {}

  async addFeedTag(feedId: string, name: string): Promise<FeedTag> {
    // tag id or tag name
    return await this.feedTagRepository.save({ feedId: feedId, name: name });
  }
  async deleteFeedTag(feedId: string, tagId: string) {
    return await this.feedTagRepository.delete({
      feedId: feedId,
      id: tagId,
    });
  }

  /* 태그 업데이트시 삭제, 그전까지 사용. */
  async addFeedTagNameOnly(feedId: string, name: string) {
    return await this.feedTagRepository.save({ feedId: feedId, name: name });
  }
  async deleteFeedTagNameOnly(feedId: string, tagId: string) {
    return await this.feedTagRepository.delete({
      feedId: feedId,
      id: tagId,
    });
  }

  async findTagList(name: string) {
    return await this.feedTagRepository.findTagList(name);
  }

  async getFeedListOverTag(
    options: IPaginationOptions,
    name: string,
    pageDate: Date,
  ) {
    const searchOptions: any = {
      relations: ['feed', 'feed.writer', 'feed.writer.picture', 'feed.tags'],
      where: {
        name: name,
        feed: {
          state: 'feed_state_posting',
          deletedAt: IsNull(),
          createdAt: LessThanOrEqual(pageDate),
        },
      },
    };

    const feedTagPage = await paginate<FeedTag>(
      this.feedTagRepository,
      options,
      searchOptions,
    );

    return feedTagPage;
  }

  /* 태그가 사용된 갯수 가져오기 */
  async getTagCount(tagId: string) {
    return await this.feedTagRepository.countBy({ id: tagId });
  }
}
