import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedCommentLikeRepository } from './comment-like.repository';
import { FeedComment } from '../feed-comment.entity';
import { FeedCommentRepository } from '../feed-comment.repository';

@Injectable()
export class FeedCommentLikeService {
  constructor(
    @InjectRepository(FeedCommentLikeRepository)
    private feedCommentLikeRepository: FeedCommentLikeRepository,
    @InjectRepository(FeedCommentRepository)
    private feedCommentRepository: FeedCommentRepository,
  ) {}

  async createLike(feedCommentId: string, userId: string): Promise<number> {
    await this.feedCommentLikeRepository.save({
      feedCommentId: feedCommentId,
      userId: userId,
    });
    return await this.getCount(feedCommentId);
  }

  async createLikeAndReturnComment(
    feedCommentId: string,
    userId: string,
  ): Promise<FeedComment | null> {
    await this.feedCommentLikeRepository.save({
      feedCommentId: feedCommentId,
      userId: userId,
    });

    const feedCommentOptions: any = {
      where: { id: feedCommentId },
      relations: ['writer', 'mentions', 'likes'],
    };

    return await this.feedCommentRepository.findOneBy(feedCommentOptions);
  }

  async deleteLike(feedCommentId: string, userId: string): Promise<number> {
    await this.feedCommentLikeRepository.delete({
      feedCommentId: feedCommentId,
      userId: userId,
    });

    return await this.getCount(feedCommentId);
  }

  async getCount(feedCommentId: string): Promise<number> {
    return await this.feedCommentLikeRepository.countBy({
      feedCommentId: feedCommentId,
    });
  }
}
