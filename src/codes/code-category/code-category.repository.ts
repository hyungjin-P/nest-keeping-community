import { Repository } from 'typeorm';
import { CodeCategory } from './code-category.entity';
import { CustomRepository } from '../../common/custom-type-orm.decorator';

@CustomRepository(CodeCategory)
export class CodeCategoryRepository extends Repository<CodeCategory> {}
