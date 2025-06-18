import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CodeCategory {
  @PrimaryColumn()
  id: string;

  @Column()
  textKo: string;

  @Column()
  textEn: string;

  @Column()
  sequenceNumber: number;

  @Column()
  selectYn: boolean;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  updatedBy: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
