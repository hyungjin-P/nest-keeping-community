import { EntityRepository, Repository } from 'typeorm';
import { AdminMenu } from './admin-menu.entity';

@EntityRepository(AdminMenu)
export class AdminMenuRepository extends Repository<AdminMenu> {}
