import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CommonUtil } from '../utiles/common.util';
import { EmailService } from '../services/email/email.service';
import { FollowModule } from './follow/follow.module';
import { UserPictureModule } from './user-picture/user-picture.module';
import { UserBackgroundModule } from './user-background/user-background.module';
import { UserPictureRepository } from './user-picture/user-picture.repository';
import { UserBackgroundRepository } from './user-background/user-background.repository';
import { UserBackgroundService } from './user-background/user-background.service';
import { CryptoService } from '../services/crypto/crypto.service';
import { UserWithdrawalTemporaryService } from './user-withdrawal-temporary/user-withdrawal-temporary.service';
import { UserWithdrawalTemporaryRepository } from './user-withdrawal-temporary/user-withdrawal-temporary.repository';
import { UserSearchService } from './user-search/user-search.service';
import { UserSearchRepository } from './user-search/user-search.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      UserPictureRepository,
      UserBackgroundRepository,
      UserWithdrawalTemporaryRepository,
      UserSearchRepository,
    ]),
    FollowModule,
    UserPictureModule,
    UserBackgroundModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    CommonUtil,
    EmailService,
    UserBackgroundService,
    CryptoService,
    UserWithdrawalTemporaryService,
    UserSearchService,
  ],
  exports: [UserService],
})
export class UserModule {}
