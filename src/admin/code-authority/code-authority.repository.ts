import { EntityRepository, Repository } from 'typeorm';
import { CodeAuthority } from './code-authority.entity';

@EntityRepository(CodeAuthority)
export class CodeAuthorityRepository extends Repository<CodeAuthority> {}
