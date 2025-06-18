import { Injectable } from '@nestjs/common';
import { FeedBookmarkRepository } from './feed-bookmark.repository';
import { FeedBookmarkDto } from '../dto/feed-bookmark.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { FeedBookmark } from './feed-bookmark.entity';
import { FindOptionsWhere, IsNull, LessThanOrEqual } from 'typeorm';

@Injectable()
export class FeedBookmarkService {
  constructor(private feedBookmarkRepository: FeedBookmarkRepository) {}

  /**
   * 북마크 추가
   * @param feedBookmarkDto
   */
  async addBookmark(feedBookmarkDto: FeedBookmarkDto): Promise<void> {
    await this.feedBookmarkRepository.save({
      feedId: feedBookmarkDto.feedId,
      userId: feedBookmarkDto.userId,
    });
  }

  /**
   * 북마크 제거
   * @param feedBookmarkDto
   */
  async deleteBookmark(feedBookmarkDto: FeedBookmarkDto): Promise<void> {
    await this.feedBookmarkRepository.delete({
      feedId: feedBookmarkDto.feedId,
      userId: feedBookmarkDto.userId,
    });
  }

  /**
   * 사용자의 북마크 전체 삭제
   * @param userId
   */
  async deleteAllBookmarkOfUser(userId: string) {
    return await this.feedBookmarkRepository.delete({ userId });
  }

  /**
   * 피드의 북마크 전체 삭제
   * @param feedId
   */
  async deleteAllBookmarkOfFeed(feedId: string) {
    return await this.feedBookmarkRepository.delete({ feedId });
  }

  async getFeedListOverBookmark(options: IPaginationOptions, userId: string) {
    const searchOptions: FindOptionsWhere<any> = {
      relations: ['feed', 'feed.writer', 'feed.writer.picture', 'feed.tags'],
      where: {
        userId: userId,
        feed: {
          deletedAt: IsNull(),
        },
      },
    };

    const bookmarkCount: number = await this.feedBookmarkRepository.count({
      relations: ['feed'],
      where: {
        userId: userId,
        feed: { deletedAt: IsNull() },
      },
    });

    const feedBookmarkPage = await paginate<FeedBookmark>(
      this.feedBookmarkRepository,
      options,
      searchOptions,
    );

    for (const feedBookmark of feedBookmarkPage.items) {
      feedBookmark.feed.isBookmark = true;
    }

    feedBookmarkPage.meta.totalCount = bookmarkCount;

    return feedBookmarkPage;
  }
}
