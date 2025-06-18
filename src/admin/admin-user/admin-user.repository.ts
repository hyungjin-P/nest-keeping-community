import { EntityRepository, Repository } from 'typeorm';
import { AdminUser } from './admin-user.entity';

@EntityRepository(AdminUser)
export class AdminUserRepository extends Repository<AdminUser> {}
