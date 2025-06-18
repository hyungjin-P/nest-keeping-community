import { FileEntity } from './file.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FileEntity)
export class FileRepository extends Repository<FileEntity> {}
