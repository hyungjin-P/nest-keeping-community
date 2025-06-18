import { Injectable } from '@nestjs/common';
import { FeedCommentMentionRepository } from './comment-mention.repository';
import { FeedCommentMention } from './comment-mention.entity';

@Injectable()
export class FeedCommentMentionService {
  constructor(private repository: FeedCommentMentionRepository) {}

  async addMention(mention: FeedCommentMention): Promise<FeedCommentMention> {
    return await this.repository.save(mention);
  }

  async deleteMention(mentionId: string) {
    return await this.repository.delete({ id: mentionId });
  }
}
