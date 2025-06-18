import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MagazineLikeRepository } from './magazine-like.repository';
import { MagazineLikeEntity } from './magazine-like.entity';

@Injectable()
export class MagazineLikeService {
  constructor(
    @InjectRepository(MagazineLikeRepository)
    private repository: MagazineLikeRepository,
  ) {}

  async createLike(magazineId: string, userId: string) {
    await this.repository.save({ magazineId: magazineId, userId: userId });
  }

  async deleteLike(magazineId: string, userId: string) {
    await this.repository.delete({ magazineId: magazineId, userId: userId });
  }

  /*
   * 좋아요 인원 찾기 - 페이징 형식으로 변경 해야함
   * */
  async findById(magazineId: string): Promise<MagazineLikeEntity[]> {
    return await this.repository.getLikeListWithUser(magazineId);
  }
}
