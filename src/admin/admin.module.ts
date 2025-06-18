import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserRepository } from './admin-user/admin-user.repository';
import { CodeAuthorityRepository } from './code-authority/code-authority.repository';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { AdminMenuRepository } from './admin-menus/admin-menu-repository';
import { AuthorityMenusRepository } from './authority-menus/authority-menus.repository';
import { BbsBoardRepository } from './bbs-board/bbs-board.repository';
import { AdminAccessLogRepository } from './admin-access-log/admin-access-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminUserRepository,
      CodeAuthorityRepository,
      AdminMenuRepository,
      AuthorityMenusRepository,
      BbsBoardRepository,
      AdminAccessLogRepository,
    ]),
    UserModule,
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
