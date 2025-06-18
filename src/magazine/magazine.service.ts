import { Injectable } from '@nestjs/common';
import { MagazineRepository } from './magazine.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Magazine } from './magazine.entity';
import { MagazineModifyDto } from './dto/magazine.modify.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { MagazineBookmarkEntity } from './magazine-bookmark/magazine-bookmark.entity';
import { MagazineBookmarkRepository } from './magazine-bookmark/magazine-bookmark.repository';
import { MagazineBodyKoRepository } from './magazine-body-ko/magazine-body-ko.repository';
import { MagazineBodyEnRepository } from './magazine-body-en/magazine-body-en.repository';
import { MagazineViewsService } from './magazine-views/magazine-views.service';
import { LessThanOrEqual } from 'typeorm';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(MagazineRepository)
    private repository: MagazineRepository,
    private bodyKoRepository: MagazineBodyKoRepository,
    private bodyEnRepository: MagazineBodyEnRepository,
    private magazineBookmarkRepository: MagazineBookmarkRepository,

    private magazineViewService: MagazineViewsService,
  ) {}

  async getTopMagazineList(userId?: string) {
    const magazineList: Magazine[] = await this.repository.getTopList();

    if (magazineList.length > 0 && userId) {
      const magazineIds: string[] = magazineList.map((r) => r.id);
      const magazineBookmarks: MagazineBookmarkEntity[] =
        await this.magazineBookmarkRepository.findMagazineBookmarkOfUser(
          magazineIds,
          userId,
        );

      for (const magazine of magazineList) {
        if (magazineBookmarks.length > 0) {
          const isBookmark = magazineBookmarks.filter(
            (magazineBookmark) => magazineBookmark.magazineId === magazine.id,
          ).length;
          magazine.isBookmark = isBookmark > 0;
        }
      }
    }

    return magazineList;
  }

  async findByPage(
    options: IPaginationOptions,
    category: string,
    pageDate: Date,
  ): Promise<Pagination<any>> {
    const searchOptions: any = {
      relations: ['en', 'ko', 'writer', 'writer.picture', 'tags'],
      where: (qb) => {
        qb.where({
          state: 'magazine_state_posting',
          createdAt: LessThanOrEqual(pageDate),
        });
      },
    };

    if (category !== 'all') {
      searchOptions.where = (qb) => {
        qb.where({
          state: 'magazine_state_posting',
          category: category,
        });
      };
    }

    const magazinePage = await paginate<Magazine>(
      this.repository,
      options,
      searchOptions,
    );

    // if (category === 'all') {
    //   magazinePage = await this.repository.findPagesAll(options);
    // } else {
    //   magazinePage = await this.repository.findPages(options, category);
    // }

    // 조회 수 가져오기
    /*if (magazinePage.items.length > 0) {
      for (const magazine of magazinePage.items) {
        magazine.viewCount = await this.magazineViewService.getCount(
          magazine.id,
        );
      }
    }*/

    return magazinePage;
  }

  async findByPageWithUserBehavior(
    options: IPaginationOptions,
    category: string,
    userId: string,
    pageDate: Date,
  ): Promise<Pagination<any>> {
    const searchOptions: any = {
      relations: ['en', 'ko', 'writer', 'writer.picture', 'tags'],
      where: (qb) => {
        qb.where({
          state: 'magazine_state_posting',
          createdAt: LessThanOrEqual(pageDate),
        });
      },
    };

    if (category !== 'all') {
      searchOptions.where = (qb) => {
        qb.where({
          state: 'magazine_state_posting',
          category: category,
        });
      };
    }

    const magazinePage = await paginate<Magazine>(
      this.repository,
      options,
      searchOptions,
    );

    if (magazinePage.items.length > 0) {
      //magazine bookmark checking
      const magazineIds: string[] = magazinePage.items.map((r) => r.id);

      const magazineBookmarks: MagazineBookmarkEntity[] =
        await this.magazineBookmarkRepository.findMagazineBookmarkOfUser(
          magazineIds,
          userId,
        );

      for (const magazine of magazinePage.items) {
        /*magazine.viewCount = await this.magazineViewService.getCount(
          magazine.id,
        );*/

        if (magazineBookmarks.length > 0) {
          const isBookmark = magazineBookmarks.filter(
            (magazineBookmark) => magazineBookmark.magazineId === magazine.id,
          ).length;
          magazine.isBookmark = isBookmark > 0;
        }
      }
    }

    return magazinePage;
  }

  async create(magazine: Magazine) {
    let magazineRows: Magazine | null = await this.repository.findOneBy({
      userId: magazine.userId,
      state: 'magazine_state_pending',
    });

    if (magazineRows && magazine.rewrite === true) {
      await this.repository.delete({ id: magazineRows.id });
      magazineRows = null;
    }

    if (!magazineRows) {
      magazineRows = await this.repository.save(magazine);
      await this.bodyKoRepository.save({ magazineId: magazineRows.id });
      await this.bodyEnRepository.save({ magazineId: magazineRows.id });
    }

    return magazineRows;
  }

  async modify(id: string, magazine: MagazineModifyDto) {
    const magazineRow: Magazine | null = await this.repository.findOneBy({
      id: id,
    });

    if (magazineRow){
      if (magazine.posting == true) {
        magazineRow.state = 'magazine_state_posting';
      }

      return await this.repository.save(magazineRow);
    }
  }

  async delete(id: string) {
    const magazineRow: Magazine | null = await this.repository.findOneBy({ id });

    if (magazineRow){
      magazineRow.deletedAt = new Date();

      await this.repository.save(magazineRow);
    }
  }

  async findByPageOverBookmark(
    options: IPaginationOptions,
    userId: string,
  ): Promise<Pagination<Magazine>> {
    // 북마크한 매거진 조회
    const bookmarkMagazines = await this.magazineBookmarkRepository.findBy({
      userId: userId,
    });

    const bookmarkMagazineCount = await this.magazineBookmarkRepository.countBy({
      userId: userId,
    });

    const bookmarkMagazineIds = bookmarkMagazines.map((r) => r.magazineId);

    // 매거진 조회, magazineId in (bookmarkUserIds)
    const searchOptions: any = {
      join: {
        alias: 'magazine',
      },
      relations: ['en', 'ko', 'writer', 'writer.picture', 'tags'],
      where: (qb) => {
        qb.where({
          state: 'magazine_state_posting',
        }).andWhere('magazine.id IN (:magazineIds)', {
          magazineIds: bookmarkMagazineIds,
        });
      },
    };

    const magazinePage = await paginate<Magazine>(
      this.repository,
      options,
      searchOptions,
    );

    // 추가 데이터 호출
    magazinePage.meta.totalCount = bookmarkMagazineCount;

    if (magazinePage.items.length > 0) {
      for (const magazine of magazinePage.items) {
        // 북마크한 게시물만 불렀기에 isBookmark 는 true 상태
        magazine.isBookmark = true;
      }
    }
    return magazinePage;
  }
}
