import { Injectable } from '@nestjs/common';
import { FeedTopicRepository } from './feed-topic.repository';

@Injectable()
export class FeedTopicService {
  constructor(private repository: FeedTopicRepository) {}

  async getTagCount(id: string) {
    return 0;
  }

  async addTopic(feedId: string, topicId: string) {
    return await this.repository.save({ feedId, topicId });
  }

  async deleteTopic(id: string) {
    return await this.repository.delete({ id });
  }
}
