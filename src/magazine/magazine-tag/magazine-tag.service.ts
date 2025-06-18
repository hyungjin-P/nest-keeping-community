import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MagazineTagRepository } from './magazine-tag.repository';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { MagazineTagEntity } from './magazine-tag.entity';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class MagazineTagService {
  constructor(
    @InjectRepository(MagazineTagRepository)
    private repository: MagazineTagRepository,
  ) {}

  async addTag(magazineId: string, nameKo: string, nameEn: string) {
    return await this.repository.save({ magazineId, nameKo, nameEn });
  }

  async deleteTag(magazineId: string, tagId: string) {
    return await this.repository.delete({
      magazineId: magazineId,
      id: tagId,
    });
  }

  async findTagList(name: string) {
    return await this.repository.findTagList(name);
  }

  async getMagazineListOverTag(
    options: IPaginationOptions,
    tagId: string,
    pageDate: Date,
  ): Promise<Pagination<MagazineTagEntity>> {
    const searchOptions: any = {
      relations: [
        'magazine',
        'magazine.en',
        'magazine.ko',
        'magazine.writer',
        'magazine.writer.picture',
        'magazine.tags',
      ],
      where: (qb) => {
        qb.where({
          tagId: tagId,
          magazine: {
            state: 'magazine_state_posting',
            createdAt: LessThanOrEqual(pageDate),
          },
        });
      },
    };

    const magazineTagPage = await paginate<MagazineTagEntity>(
      this.repository,
      options,
      searchOptions,
    );

    return magazineTagPage;
  }

  /* 태그가 사용된 갯수 가져오기 */
  async getTagCount(tagId: string) {
    return await this.repository.countBy({ id: tagId });
  }
}
