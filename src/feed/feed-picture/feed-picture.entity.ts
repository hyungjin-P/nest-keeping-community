import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feed } from '../feed.entity';

@Entity('feed_picture', {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class FeedPicture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  feedId: string;

  @PrimaryColumn()
  url: string;

  @ManyToOne((type) => Feed, (feed) => feed.pictures, {
    onDelete: 'CASCADE',
  })
  feed: Feed;

  @CreateDateColumn()
  createdAt: Date;
}
