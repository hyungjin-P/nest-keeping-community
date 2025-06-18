import { EntityRepository, Repository } from 'typeorm';
import { FeedTopic } from './feed-topic.entity';

@EntityRepository(FeedTopic)
export class FeedTopicRepository extends Repository<FeedTopic> {}
