import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FindFeedEntity } from './find-feed.entity';

@Entity('feed_picture')
export class FindFeedPictureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  feedId: string;

  @PrimaryColumn()
  url: string;

  @ManyToOne(() => FindFeedEntity, (feed) => feed.pictures, {
    onDelete: 'CASCADE',
  })
  feed: FindFeedEntity;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  created_at: Date;
}
