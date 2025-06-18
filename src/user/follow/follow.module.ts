import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRepository } from './follow.repository';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';
import { UserPictureRepository } from '../user-picture/user-picture.repository';
import { UserBackgroundRepository } from '../user-background/user-background.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FollowRepository,
      UserRepository,
      UserPictureRepository,
      UserBackgroundRepository,
    ]),
  ],
  providers: [FollowService, UserService],
  controllers: [FollowController],
})
export class FollowModule {}
