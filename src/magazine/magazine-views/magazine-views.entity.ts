import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('magazine_views')
export class MagazineViews {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  magazineId: string;
  @Column()
  userId: string;
  @CreateDateColumn()
  createdAt: Date;
}
