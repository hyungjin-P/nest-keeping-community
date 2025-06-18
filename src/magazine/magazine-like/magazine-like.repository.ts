import { EntityRepository, getManager, Repository } from 'typeorm';
import { MagazineLikeEntity } from './magazine-like.entity';

@EntityRepository(MagazineLikeEntity)
export class MagazineLikeRepository extends Repository<MagazineLikeEntity> {
  async getLikeListWithUser(magazineId: string) {
    const likeList: any[] = await getManager()
      .createQueryBuilder('magazine_like', 'magazineLike')
      .select('magazineLike.magazineId, magazineLike.userId')
      .addSelect('user.nickname, user.email')
      .addSelect('picture.url')
      .leftJoin('user', 'user', 'magazineLike.userId = user.id')
      .leftJoin('user_picture', 'picture', 'user.id = picture.user_id')
      .where('magazineLike.magazine_id = :magazineId', {
        magazineId: magazineId,
      })
      .getRawMany();

    return likeList;
  }
}
