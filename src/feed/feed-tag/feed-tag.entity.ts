import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { Feed } from '../feed.entity';

@Entity('feed_tag', {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class FeedTag {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @Column()
  feedId: string;

  @Column()
  name: string;

  @ManyToOne((type) => Feed, (feed) => feed.tags, {
    onDelete: 'CASCADE',
  })
  feed: Feed;

  @CreateDateColumn()
  createdAt: Date;
}
