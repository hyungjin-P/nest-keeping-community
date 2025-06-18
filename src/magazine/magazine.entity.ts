import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MagazineBodyEn } from './magazine-body-en/magazine-body-en.entity';
import { MagazineBodyKo } from './magazine-body-ko/magazine-body-ko.entity';
import { PublicUserProFile } from '../user/public/public.user.entity';
import { MagazineTagEntity } from './magazine-tag/magazine-tag.entity';
import { MagazineBookmarkEntity } from './magazine-bookmark/magazine-bookmark.entity';

@Entity('magazine', {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class Magazine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ default: 'cba1a1c5-eefa-4926-ba04-1331d3659c14' })
  @Column()
  userId: string;

  @OneToOne((type) => PublicUserProFile, (user) => user.magazine)
  @JoinColumn({ name: 'user_id' })
  writer: PublicUserProFile;

  @ApiProperty({
    enum: ['magazine_category_news', 'magazine_category_release'],
  })
  @Column()
  category: string;

  @Column()
  state: string;

  @Column()
  picture: string;

  @Column()
  topViewNumber: number;

  @DeleteDateColumn()
  deletedAt: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  // Swagger 송신 테스트 용도
  @ApiProperty({ default: false })
  rewrite: boolean;

  /* 좋아요 여부 */
  isLike = false;

  /* 북마크 여부 */
  isBookmark = false;

  likeCount = 0;
  viewCount = 0;

  body: any;

  @OneToOne((type) => MagazineBodyEn, (body) => body.magazine)
  en: MagazineBodyEn;

  @OneToOne((type) => MagazineBodyKo, (body) => body.magazine)
  ko: MagazineBodyKo;

  @OneToMany((type) => MagazineTagEntity, (tag) => tag.magazine)
  tags: MagazineTagEntity[];

  @OneToMany(
    () => MagazineBookmarkEntity,
    (magazineBookmark) => magazineBookmark.magazine,
  )
  bookmarks: MagazineBookmarkEntity[];
}
