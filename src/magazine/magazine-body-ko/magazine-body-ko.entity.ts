import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Magazine } from '../magazine.entity';

@Entity('magazine_body_ko')
export class MagazineBodyKo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  magazineId: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @OneToOne((type) => Magazine, (magazine) => magazine.en)
  @JoinColumn({ name: 'magazine_id' })
  magazine: Magazine;
}
