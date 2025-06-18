import { EntityRepository, Repository } from 'typeorm';
import { MagazineCommentEntity } from './magazine-comment.entity';

@EntityRepository(MagazineCommentEntity)
export class MagazineCommentRepository extends Repository<MagazineCommentEntity> {}
