import { EntityRepository, getRepository, Repository } from 'typeorm';
import { MagazineTagEntity } from './magazine-tag.entity';

@EntityRepository(MagazineTagEntity)
export class MagazineTagRepository extends Repository<MagazineTagEntity> {
  async findTagList(name: string) {
    return await getRepository(MagazineTagEntity)
      .createQueryBuilder('magazine_tag')
      .select('magazine_tag.name_en AS nameEn')
      .addSelect('magazine_tag.name_ko AS nameKo')
      .addSelect('COUNT(*) AS tagCount')
      .where(
        "REPLACE(magazine_tag.name_ko, ' ', '') REGEXP :name OR REPLACE(magazine_tag.name_en, ' ', '') REGEXP :name",
        {
          name: name,
        },
      )
      .groupBy('magazine_tag.name_ko')
      .getRawMany();
  }
}
