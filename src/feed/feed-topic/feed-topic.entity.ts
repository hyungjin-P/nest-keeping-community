import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TopicItem } from '../../topic/topic-item/topic-item.entity';

@Entity('feed_topic')
export class FeedTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  feedId: string;

  @Column()
  topicId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne((type) => TopicItem, (topic) => topic.feedTopic)
  @JoinColumn({ name: 'topic_id' })
  topic: TopicItem;
}
