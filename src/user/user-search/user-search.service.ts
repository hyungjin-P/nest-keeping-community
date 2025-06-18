import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSearchRepository } from './user-search.repository';

@Injectable()
export class UserSearchService {
  constructor(
    @InjectRepository(UserSearchRepository)
    private repository: UserSearchRepository,
  ) {}

  async saveSearchHistory(userId: string, text: string) {
    return this.repository.save({ userId, text });
  }

  async deleteSearchHistory(id: string) {
    return this.repository.softDelete({ id });
  }

  async deleteSearchHistoryAll(userId: string) {
    return this.repository.softDelete({ userId });
  }
}
