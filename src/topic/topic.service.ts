import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicItemRepository } from './topic-item/topic-item.repository';
import { TopicItem } from './topic-item/topic-item.entity';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicItemRepository)
    private repository: TopicItemRepository,
  ) {}

  async getTopicList() {
    return await this.repository.find();
  }

  async findTopicList(name: string) {
    // 공백 포함 검색 예시
    // select * from magazine_tag where name_en REGEXP 'DARK[[:space:]]?KNIGHT'
    // 공백 -> [[:space:]]?

    // 25.06.13 현재 사용 불가
    // name = name.replace(' ', '[[:space:]]?');
    // const topicItems: TopicItem[] = await this.repository.find({
    //   where: (qb) => {
    //     qb.where(
    //       "REPLACE(name_ko, ' ', '') REGEXP :name OR REPLACE(name_en, ' ', '') REGEXP :name",
    //       { name: name },
    //     );
    //   },
    // });

    return null;
  }

  /* 관리자 영역 생성, 수정, 삭제 */
  async createTopic(nameKo: string, nameEn: string) {
    return await this.repository.save({ nameKo, nameEn });
  }

  async modifyTopic(tagId: string, nameKo: string, nameEn: string) {
    return await this.repository.save({
      id: tagId,
      nameKo: nameKo,
      nameEn: nameEn,
    });
  }

  async deleteTopic(tagId: string) {
    return await this.repository.delete({ id: tagId });
  }
}
