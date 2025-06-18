import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  ViewColumn,
  ViewEntity,
} from 'typeorm';
import { UserPicture } from '../user-picture/user-picture.entity';
import { Feed } from '../../feed/feed.entity';
import { FeedLike } from '../../feed/feed-like/feed-like.entity';
import { UserBackground } from '../user-background/user-background.entity';
import { type } from 'os';
import { FeedComment } from '../../feed/feed-comment/feed-comment.entity';
import { FeedCommentMention } from '../../feed/feed-comment/comment-mention/comment-mention.entity';
import { Magazine } from '../../magazine/magazine.entity';

@Entity('user')
export class PublicUserProFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  isFollow: boolean;

  // @ViewColumn()
  // aboutMe: string;

  @OneToMany((type) => UserPicture, (picture) => picture.user)
  picture: UserPicture[];

  @OneToMany((type) => UserBackground, (background) => background.user)
  background: UserBackground[];

  @OneToOne((type) => Feed, (feed) => feed.writer)
  feed: Feed;

  @OneToOne((type) => Magazine, (magazine) => magazine.writer)
  magazine: Magazine;

  @OneToOne((type) => FeedLike, (feedLike) => feedLike.user)
  feedLike: FeedLike;

  @OneToOne((type) => FeedComment, (feedComment) => feedComment.writer)
  feedComment: FeedComment;

  @OneToOne(
    (type) => FeedCommentMention,
    (feedCommentMention) => feedCommentMention.mentionUser,
  )
  feedCommentMention: FeedCommentMention;
}
