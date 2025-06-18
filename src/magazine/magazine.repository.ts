import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Magazine } from './magazine.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@EntityRepository(Magazine)
export class MagazineRepository extends Repository<Magazine> {
  // doesn't use this repository function

  async findPages(
    options: IPaginationOptions,
    category: string,
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Magazine)
      .createQueryBuilder('magazine')
      .leftJoinAndSelect('magazine.en', 'en')
      .leftJoinAndSelect('magazine.ko', 'ko')
      .leftJoinAndSelect('magazine.writer', 'user')
      .leftJoinAndSelect('user.picture', 'userPicture')
      .leftJoinAndSelect('magazine.tags', 'tags')
      .where('category = :category', { category: category })
      .andWhere('state = :state', { state: 'magazine_state_posting' })
      .orderBy({ 'magazine.created_at': 'DESC', 'tags.created_at': 'DESC' });
    return await paginate<Magazine>(queryBuilder, options);
  }

  async findPagesAll(options: IPaginationOptions): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Magazine)
      .createQueryBuilder('magazine')
      .leftJoinAndSelect('magazine.en', 'en')
      .leftJoinAndSelect('magazine.ko', 'ko')
      .leftJoinAndSelect('magazine.writer', 'user')
      .leftJoinAndSelect('user.picture', 'userPicture')
      .leftJoinAndSelect('magazine.tags', 'tags')
      .where('magazine.state = :state', { state: 'magazine_state_posting' })
      .orderBy({ 'magazine.created_at': 'DESC', 'tags.created_at': 'DESC' });
    return await paginate<Magazine>(queryBuilder, options);
  }

  async findMagazinePageByMagazineIds(
    options: IPaginationOptions,
    magazineIds: string[],
  ): Promise<Pagination<any>> {
    const queryBuilder = await getRepository(Magazine)
      .createQueryBuilder('magazine')
      .leftJoinAndSelect('magazine.en', 'en')
      .leftJoinAndSelect('magazine.ko', 'ko')
      .leftJoinAndSelect('magazine.writer', 'user')
      .leftJoinAndSelect('user.picture', 'userPicture')
      .leftJoinAndSelect('magazine.tags', 'tags')
      .where(
        'magazine.id in (:magazineIds) and magazine.state = :magazineState',
        {
          magazineIds: magazineIds,
          magazineState: 'magazine_state_posting',
        },
      )
      .orderBy('magazine.created_at', 'DESC');

    return await paginate<Magazine>(queryBuilder, options);
  }

  async getTopList(): Promise<Magazine[]> {
    return await getRepository(Magazine)
      .createQueryBuilder('magazine')
      .leftJoinAndSelect('magazine.en', 'en')
      .leftJoinAndSelect('magazine.ko', 'ko')
      .leftJoinAndSelect('magazine.writer', 'user')
      .leftJoinAndSelect('user.picture', 'userPicture')
      .leftJoinAndSelect('magazine.tags', 'tags')
      .where('magazine.state = :state', { state: 'magazine_state_posting' })
      .andWhere('magazine.top_view_number is not null')
      .orderBy({
        'magazine.top_view_number': 'ASC',
        'tags.created_at': 'DESC',
      })
      .getMany();
  }
}
