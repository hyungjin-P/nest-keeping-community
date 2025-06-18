import { Injectable } from '@nestjs/common';
import { MagazineBookmarkRepository } from './magazine-bookmark.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { MagazineBookmarkEntity } from './magazine-bookmark.entity';

@Injectable()
export class MagazineBookmarkService {
  constructor(private repository: MagazineBookmarkRepository) {}

  async createBookmark(magazineId: string, userId: string) {
    return await this.repository.save({
      magazineId: magazineId,
      userId: userId,
    });
  }

  async deleteBookmark(magazineId: string, userId: string) {
    return await this.repository.delete({
      magazineId: magazineId,
      userId: userId,
    });
  }

  async deleteAllBookmark(userId: string) {
    return await this.repository.delete({ userId: userId });
  }

  async getMagazineOverBookmark(options: IPaginationOptions, userId: string) {
    const searchOptions: any = {
      relations: [
        'magazine',
        'magazine.en',
        'magazine.ko',
        'magazine.writer',
        'magazine.writer.picture',
        'magazine.tags',
      ],
      where: {
        userId: userId,
      },
    };

    const magazinePage = await paginate<MagazineBookmarkEntity>(
      this.repository,
      options,
      searchOptions,
    );

    const bookmarkMagazineCount = await this.repository.countBy({
      userId: userId,
    });

    magazinePage.meta.totalCount = bookmarkMagazineCount;

    if (magazinePage.items.length > 0) {
      for (const magazine of magazinePage.items) {
        // 북마크한 게시물만 불렀기에 isBookmark 는 true 상태
        magazine.magazine.isBookmark = true;
      }
    }

    return magazinePage;
  }
}
