import { EntityRepository, Repository } from 'typeorm';
import { MagazineBodyEn } from './magazine-body-en.entity';

@EntityRepository(MagazineBodyEn)
export class MagazineBodyEnRepository extends Repository<MagazineBodyEn> {}
