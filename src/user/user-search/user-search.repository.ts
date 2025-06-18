import { EntityRepository, Repository } from 'typeorm';
import { UserSearch } from './user-search.entity';

@EntityRepository(UserSearch)
export class UserSearchRepository extends Repository<UserSearch> {}
