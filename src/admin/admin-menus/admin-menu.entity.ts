import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('admin-menu')
export class AdminMenu extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  menuName: string;

  @Column()
  parentId: string;

  @Column()
  url: string;

  @Column()
  sort: number;

  @Column()
  depth: number;

  @Column()
  modifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
