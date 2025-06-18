import { EntityRepository, Repository } from 'typeorm';
import { UserPicture } from './user-picture.entity';

@EntityRepository(UserPicture)
export class UserPictureRepository extends Repository<UserPicture> {}
