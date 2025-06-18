import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 공지사항, 이벤트 등 사이트 게시판
 */
@Entity('bbs_board')
export class BbsBoard extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  category: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  hit: number;

  @Column()
  attachFileUrl1: string;

  @Column()
  attachFileUrl2: string;

  @Column()
  attachFileUrl3: string;

  @Column()
  isFixed: boolean;

  @Column()
  eventName: string;

  @Column()
  disabled: boolean;

  @Column()
  createdAt: Date;

  @Column()
  modifiedAt: Date;

  @Column()
  deletedAt: Date;

  @Column()
  status: string;
}
