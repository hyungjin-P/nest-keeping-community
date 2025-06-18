import { EntityRepository, Repository } from 'typeorm';
import { MagazinePictureEntity } from './magazine-picture.entity';

@EntityRepository(MagazinePictureEntity)
export class MagazinePictureRepository extends Repository<MagazinePictureEntity> {}
