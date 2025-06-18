import { EntityRepository, Repository } from 'typeorm';
import { UserWithdrawalTemporary } from './user-withdrawal-temporary.entity';

@EntityRepository(UserWithdrawalTemporary)
export class UserWithdrawalTemporaryRepository extends Repository<UserWithdrawalTemporary> {}
