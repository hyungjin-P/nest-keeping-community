import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryColumn()
  bucket: string;

  @PrimaryColumn()
  key: string;

  @Column()
  userId: string;

  @Column({ comment: 'S3 location url' })
  url: string;

  @Column()
  originalname: string;

  @Column()
  encoding: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  acl: string;

  @Column()
  location: string;

  @Column()
  etag: string;

  // @Column({ nullable: true })
  // versionId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
  })
  createdAt: Date;
}
