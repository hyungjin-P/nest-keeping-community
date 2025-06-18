import { EntityRepository, getRepository, Repository } from 'typeorm';
import { MagazineBookmarkEntity } from './magazine-bookmark.entity';

@EntityRepository(MagazineBookmarkEntity)
export class MagazineBookmarkRepository extends Repository<MagazineBookmarkEntity> {
  async findMagazineBookmarkOfUser(
    magazineIds: string[],
    userId: string,
  ): Promise<MagazineBookmarkEntity[]> {
    return await getRepository(MagazineBookmarkEntity)
      .createQueryBuilder('magazine_bookmark')
      .where('magazine_id in (:magazineIds) and user_id = :userId', {
        magazineIds,
        userId,
      })
      .printSql()
      .getMany();
  }
}
