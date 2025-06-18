import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FeedCommentMention } from './comment-mention/comment-mention.entity';
import { PublicUserProFile } from '../../user/public/public.user.entity';
import { FeedCommentLike } from './commnet-like/commnet-like.entity';
import { FindFeedEntity } from '../feed-dao/find-feed.entity';

@Entity('feed_comment', {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class FeedComment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty({ default: 'ab27c954-5f79-458c-8a0a-c64497c81a5d' })
  feedId: string;

  @Column()
  @ApiProperty({ default: 'a41d829e-add3-4867-9429-0eca34fc1e48' })
  userId: string;

  @Column()
  @ApiProperty({ nullable: true })
  parentId: string;

  @Column()
  @ApiProperty()
  text: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne((type) => PublicUserProFile, (user) => user.feedComment)
  @JoinColumn({ name: 'user_id' })
  writer: PublicUserProFile;

  @OneToMany((type) => FeedCommentMention, (mention) => mention.feedComment, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  mentions: FeedCommentMention[];

  @OneToMany((type) => FeedCommentLike, (like) => like.feedComment, {
    onDelete: 'CASCADE',
  })
  likes: FeedCommentLike[];

  @ManyToOne(() => FindFeedEntity, (feed) => feed.comments)
  feed: FindFeedEntity;

  likeCount?: number;
  isLike = false;
}
