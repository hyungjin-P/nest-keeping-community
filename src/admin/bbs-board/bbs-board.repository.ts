import { BbsBoard } from './bbs-board.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(BbsBoard)
export class BbsBoardRepository extends Repository<BbsBoard> {}
