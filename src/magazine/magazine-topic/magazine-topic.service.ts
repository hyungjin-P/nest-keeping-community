import { Injectable } from '@nestjs/common';
import { MagazineTopicRepository } from './magazine-topic.repository';

@Injectable()
export class MagazineTopicService {
  constructor(private repository: MagazineTopicRepository) {}

  async getTagCount(id: string) {
    return 0;
  }
}
