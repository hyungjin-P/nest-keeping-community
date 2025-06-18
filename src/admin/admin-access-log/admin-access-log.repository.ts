import { EntityRepository, Repository } from 'typeorm';
import { AdminAccessLog } from './admin-access-log.entity';

@EntityRepository(AdminAccessLog)
export class AdminAccessLogRepository extends Repository<AdminAccessLog> {}
