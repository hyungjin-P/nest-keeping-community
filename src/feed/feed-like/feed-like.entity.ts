import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Feed } from '../feed.entity';
import { PublicUserProFile } from '../../user/public/public.user.entity';

@Entity()
export class FeedLike {
  @PrimaryColumn()
  feedId: string;

  @PrimaryColumn()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => Feed, (feed) => feed.likeUsers, {
    onDelete: 'CASCADE',
  })
  feed: Feed;

  @OneToOne((type) => PublicUserProFile, (user) => user.feedLike)
  @JoinColumn()
  user: PublicUserProFile;

  likeCount: number;
}
