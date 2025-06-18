import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('authority_menus')
export class AuthorityMenus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adminMenuId: string;

  @Column()
  codeAuthorityId: string;

  @Column()
  modifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
