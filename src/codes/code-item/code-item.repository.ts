import { Repository } from 'typeorm';
import { CodeItem } from './code-item.entity';
import { CustomRepository } from '../../common/custom-type-orm.decorator';

@CustomRepository(CodeItem)
export class CodeItemRepository extends Repository<CodeItem> {}
