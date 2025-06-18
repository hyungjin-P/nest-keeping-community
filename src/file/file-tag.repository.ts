import { EntityRepository, Repository } from 'typeorm';
import { FileTag } from './file-tag.entity';

@EntityRepository(FileTag)
export class FileTagRepository extends Repository<FileTag> {}
