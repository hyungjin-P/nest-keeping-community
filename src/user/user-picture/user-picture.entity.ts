import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PublicUserProFile } from '../public/public.user.entity';

@Entity('user_picture')
export class UserPicture extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne((type) => PublicUserProFile, (user) => user.picture)
  user: PublicUserProFile;
}
