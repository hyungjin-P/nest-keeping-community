import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TopicItem } from '../../topic/topic-item/topic-item.entity';

@Entity('magazine_topic')
export class MagazineTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  magazineId: string;

  @Column()
  topicId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne((type) => TopicItem, (topic) => topic.magazineTopic)
  @JoinColumn({ name: 'topic_id' })
  topic: TopicItem;
}
