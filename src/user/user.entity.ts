import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserBackground } from './user-background/user-background.entity';
import { UserPicture } from './user-picture/user-picture.entity';
import { FeedLike } from '../feed/feed-like/feed-like.entity';
import { Feed } from '../feed/feed.entity';
import { AdminUser } from '../admin/admin-user/admin-user.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider: string;

  @Column()
  providedId: string;

  @Column()
  password?: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  age: number;

  @Column()
  sex: string;

  @Column()
  birthDate: string;

  @Column()
  email: string;

  @Column()
  emailVerified: boolean;

  @Column()
  emailVerificationCode: number;

  @Column()
  emailVerificationCodeExpiresin: Date;

  @Column()
  emailToChange: string;

  @Column()
  phoneNumber: string;

  @Column()
  phoneNumberVerified: boolean;

  @Column()
  phoneNumberVerificationCode: number;

  @Column()
  phoneNumberVerificationCodeExpiresin: Date;

  @Column()
  phoneNumberToChange: boolean;

  @Column()
  resetPasswordLinkUsed: boolean;

  @Column()
  color: string;

  @Column()
  fcmToken: string;

  /* 자기소개 */
  @Column()
  aboutMe: string;

  @Column()
  agreementAge: boolean;

  @Column()
  agreementPrivacy: boolean;

  @Column()
  agreementServiceTerms: boolean;

  @Column()
  agreementMarketing: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  picture: UserPicture[];

  background: UserBackground[];

  accessToken: string;

  refreshToken: string;

  customToken: string;

  @OneToOne(() => Feed, (feed) => feed.writer)
  feed: Feed;

  @OneToOne(() => FeedLike, (feedLike) => feedLike.user)
  feedLike: FeedLike;

  metaInfo: any;

  isFollow: boolean;

  signUpType: string;

  @OneToMany(() => AdminUser, (adminUser) => adminUser.user)
  adminUser: AdminUser;

  @OneToMany(() => UserPicture, (userPicture) => userPicture.user)
  userPicture: UserPicture;

  @OneToMany(() => UserBackground, (userBackground) => userBackground.user)
  userBackground: UserBackground;
}
