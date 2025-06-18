import { EntityRepository, Repository } from 'typeorm';
import { TopicItem } from './topic-item.entity';

@EntityRepository(TopicItem)
export class TopicItemRepository extends Repository<TopicItem> {}
