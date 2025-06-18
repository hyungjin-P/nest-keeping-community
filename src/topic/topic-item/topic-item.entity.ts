import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FeedTopic } from '../../feed/feed-topic/feed-topic.entity';
import { MagazineTopic } from '../../magazine/magazine-topic/magazine-topic.entity';

@Entity('topic_item')
export class TopicItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nameKo: string;

  @Column()
  nameEn: string;

  @Column()
  url: string;

  feedCount: number;
  magazineCount: number;

  @OneToOne((type) => FeedTopic, (feed) => feed.topic)
  feedTopic: FeedTopic;

  @OneToOne((type) => MagazineTopic, (magazine) => magazine.topic)
  magazineTopic: MagazineTopic;
}
