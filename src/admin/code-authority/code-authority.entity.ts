import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AdminUser } from '../admin-user/admin-user.entity';

@Entity('code_authority')
export class CodeAuthority {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleCode: string;

  @Column()
  descriptionKo: string;

  @Column()
  descriptionEn: string;

  @Column()
  priority: number;

  @Column()
  writePermission: boolean;

  @Column()
  readPermission: boolean;

  @Column()
  modifyPermission: boolean;

  @Column()
  deletePermission: boolean;

  // @ManyToOne(() => AdminUser, (adminUser) => adminUser)
  adminUser: AdminUser;
}
