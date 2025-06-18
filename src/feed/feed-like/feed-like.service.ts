import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedLikeRepository } from './feed-like.repository';
import { FeedLike } from './feed-like.entity';

@Injectable()
export class FeedLikeService {
  constructor(
    @InjectRepository(FeedLikeRepository)
    private feedLikeRepository: FeedLikeRepository,
  ) {}

  /**
   * 피드 좋아요
   * @param feedId
   * @param userId
   * @return feedLikeCount => 좋아요 수
   */
  async createFeedLike(feedId: string, userId: string): Promise<number> {
    await this.feedLikeRepository.save({ feedId: feedId, userId: userId });
    return await this.feedLikeRepository.countBy({ feedId });
  }

  /**
   * 피드 좋아요 취소
   * @param feedId
   * @param userId
   */
  async deleteFeedLike(feedId: string, userId: string): Promise<number> {
    await this.feedLikeRepository.delete({ feedId: feedId, userId: userId });
    return await this.feedLikeRepository.countBy({ feedId });
  }

  async getCount(feedId: string): Promise<number> {
    return await this.feedLikeRepository.countBy({ feedId });
  }
}
