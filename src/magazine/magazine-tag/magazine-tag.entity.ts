import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Magazine } from '../magazine.entity';

@Entity('magazine_tag', {
  orderBy: {
    createdAt: 'DESC',
  },
})
export class MagazineTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  magazineId: string;

  @Column()
  nameKo: string;

  @Column()
  nameEn: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => Magazine, (magazine) => magazine.tags)
  magazine: Magazine;
}
