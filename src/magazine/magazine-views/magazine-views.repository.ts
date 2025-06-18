import { EntityRepository, Repository } from 'typeorm';
import { MagazineViews } from './magazine-views.entity';

@EntityRepository(MagazineViews)
export class MagazineViewsRepository extends Repository<MagazineViews> {}
