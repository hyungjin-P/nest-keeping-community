import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('admin_access_log')
export class AdminAccessLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  accessType: string;

  @Column()
  accessLocation: string;

  @Column()
  accessIpAddress: string;

  @Column()
  contents: string;

  @Column()
  actions: string;

  @CreateDateColumn()
  createdAt: Date;
}
