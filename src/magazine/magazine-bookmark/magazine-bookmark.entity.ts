import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Magazine } from '../magazine.entity';

@Entity('magazine_bookmark', {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class MagazineBookmarkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  magazineId: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Magazine, (magazine) => magazine.bookmarks)
  magazine: Magazine;
}
