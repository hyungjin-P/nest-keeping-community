import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FeedComment } from '../feed-comment.entity';

@Entity('feed_comment_like')
export class FeedCommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  feedCommentId: string;

  @Column()
  userId: string;

  @ManyToOne(() => FeedComment, (feedComment) => feedComment.likes, {
    onDelete: 'CASCADE',
  })
  feedComment: FeedComment;
}
