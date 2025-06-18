import { Injectable } from '@nestjs/common';
import { MagazineViewsRepository } from './magazine-views.repository';
import { MagazineViews } from './magazine-views.entity';

@Injectable()
export class MagazineViewsService {
  constructor(private repository: MagazineViewsRepository) {}

  async getCount(magazineId: string): Promise<number> {
    return await this.repository.countBy({ magazineId: magazineId });
  }

  async createView(magazineId: string, userId: string) {
    const views: MagazineViews | null = await this.repository.findOne(
      {
        where : {
          magazineId,
          userId,
        },
        order: { 
          createdAt: 'DESC' 
        },
      },
    );

    if (views) {
      const nowDate = new Date().getTime();
      const saveDate = new Date(views.createdAt).getTime();
      // 10분 이내 재클릭은 조회 수 미 포함
      if ((nowDate - saveDate) / 1000 / 60 < 10) {
        return;
      }
    }

    await this.repository.save({
      magazineId: magazineId,
      userId: userId,
    });
  }
}
