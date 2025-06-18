import { EntityRepository, Repository } from 'typeorm';
import { AuthorityMenus } from './authority-menus.entity';

@EntityRepository(AuthorityMenus)
export class AuthorityMenusRepository extends Repository<AuthorityMenus> {}
