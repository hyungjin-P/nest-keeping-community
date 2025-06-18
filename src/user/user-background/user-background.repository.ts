import { EntityRepository, Repository } from 'typeorm';
import { UserBackground } from './user-background.entity';

@EntityRepository(UserBackground)
export class UserBackgroundRepository extends Repository<UserBackground> {}
