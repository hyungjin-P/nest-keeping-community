import { EntityRepository, Repository } from 'typeorm';
import { MagazineBodyKo } from './magazine-body-ko.entity';

@EntityRepository(MagazineBodyKo)
export class MagazineBodyKoRepository extends Repository<MagazineBodyKo> {}
