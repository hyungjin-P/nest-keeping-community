import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FindFeedEntity } from '../feed-dao/find-feed.entity';

@Entity('feed_bookmark', {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class FeedBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  feedId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => FindFeedEntity, (feed) => feed.bookmarks)
  feed: FindFeedEntity;
}
