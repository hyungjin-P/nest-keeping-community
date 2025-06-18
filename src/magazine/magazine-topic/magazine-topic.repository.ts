import { EntityRepository, Repository } from 'typeorm';
import { MagazineTopic } from './magazine-topic.entity';

@EntityRepository(MagazineTopic)
export class MagazineTopicRepository extends Repository<MagazineTopic> {}
