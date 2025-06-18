import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { FeedPicture } from './feed-picture/feed-picture.entity';
import { FeedTag } from './feed-tag/feed-tag.entity';
import { FeedLike } from './feed-like/feed-like.entity';
import { PublicUserProFile } from '../user/public/public.user.entity';
import { User } from '../user/user.entity';

@Entity('feed', {
  orderBy: {
    uploadedAt: 'DESC',
  },
})
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty({ default: '40490ba6-7ad0-485b-914b-d8c3b882c799' })
  userId: string;

  @OneToOne((type) => PublicUserProFile, (user) => user.feed)
  @JoinColumn({ name: 'user_id' })
  writer: PublicUserProFile;

  @Column()
  state: string;

  @Column()
  content: string;

  @Column()
  picture: string;

  @OneToMany((type) => FeedPicture, (picture) => picture.feed)
  pictures: FeedPicture[];

  @OneToMany((type) => FeedTag, (tag) => tag.feed)
  tags?: FeedTag[];

  tagsStr: string;

  like?: boolean;

  @OneToMany((type) => FeedLike, (feedLike) => feedLike.feed)
  likeUsers?: FeedLike[];

  @Column()
  uploadedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  sortedAt: Date;

  rewrite: boolean;

  pictureCount?: number;

  likeCount?: number = 0;

  commentCount?: number = 0;

  // 유저가 좋아요한 피드인지
  isLike = false;

  /* 북마크 여부 */
  isBookmark = false;

  /* 조회 건수 외 표시 */
  otherCount?: number = 0;

  // 피드에 공개할 유저
  exposureUser: User[];

  // 작성자
  writingUser: User;
}
