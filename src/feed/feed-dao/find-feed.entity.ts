import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FeedPicture } from '../feed-picture/feed-picture.entity';
import { FeedTag } from '../feed-tag/feed-tag.entity';
import { FeedLike } from '../feed-like/feed-like.entity';
import { FeedComment } from '../feed-comment/feed-comment.entity';
import { FeedBookmark } from '../feed-bookmark/feed-bookmark.entity';
import { PublicUserProFile } from '../../user/public/public.user.entity';
import { User } from '../../user/user.entity';
import { UserPicture } from '../../user/user-picture/user-picture.entity';

@Entity('feed')
export class FindFeedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  state: string;

  @Column()
  content: string;

  @Column()
  picture: string;

  @OneToMany(() => FeedPicture, (picture) => picture.feed)
  pictures: FeedPicture[];

  @OneToMany(() => FeedTag, (tag) => tag.feed)
  tags: FeedTag[];

  @OneToMany(() => FeedLike, (feedLike) => feedLike.feed)
  likes: FeedLike[];

  @OneToMany(() => FeedComment, (feedComment) => feedComment.feed)
  comments: FeedComment[];

  @OneToMany(() => FeedBookmark, (feedBookmark) => feedBookmark.feed)
  bookmarks: FeedBookmark[];

  @OneToOne(() => PublicUserProFile, (user) => user.feed)
  @JoinColumn({ name: 'user_id' })
  writer: PublicUserProFile;

  @Column()
  uploadedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  likeCount?: number = 0;

  pictureCount?: number = 0;

  commentCount?: number = 0;

  isLike?: boolean = false;

  isBookmark?: boolean = false;

  userLike: FeedLike[];

  userBookmark: FeedBookmark[];

  exposureUser: User[];

  userPictures: UserPicture[];
}
