import { EntityRepository, Repository } from 'typeorm';
import { Follow } from './follow.entity';

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow> {


}
