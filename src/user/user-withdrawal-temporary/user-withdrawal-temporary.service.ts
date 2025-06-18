import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWithdrawalTemporaryRepository } from './user-withdrawal-temporary.repository';

@Injectable()
export class UserWithdrawalTemporaryService {
  constructor(
    @InjectRepository(UserWithdrawalTemporaryRepository)
    private repository: UserWithdrawalTemporaryRepository,
  ) {}

  async saveInfo(userId: string, reason: string) {
    return await this.repository.save({ userId, reason });
  }

  async delete(userId: string) {
    return await this.repository.delete({ userId: userId });
  }
}
