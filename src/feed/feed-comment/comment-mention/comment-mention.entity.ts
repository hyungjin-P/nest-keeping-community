import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FeedComment } from '../feed-comment.entity';
import { PublicUserProFile } from '../../../user/public/public.user.entity';

@Entity('feed_comment_mention')
export class FeedCommentMention {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  feedCommentId: string;

  @Column()
  @ApiProperty()
  mentionUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => FeedComment, (feedComment) => feedComment.mentions, {
    onDelete: 'CASCADE',
  })
  feedComment: FeedComment;

  @OneToOne((type) => PublicUserProFile, (user) => user.feedCommentMention, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'mention_user_id' })
  mentionUser: PublicUserProFile;
}
