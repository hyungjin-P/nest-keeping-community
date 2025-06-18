import { HttpException, Injectable } from '@nestjs/common';
import { AdminUserRepository } from './admin-user/admin-user.repository';
import { CodeAuthorityRepository } from './code-authority/code-authority.repository';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { AuthService } from '../auth/auth.service';
import { AdminUser } from './admin-user/admin-user.entity';
import { CodeAuthority } from './code-authority/code-authority.entity';
import { AdminSignInDto } from './dto/admin-signIn.dto';
import { UserFilteringDto } from './dto/user-filtering.dto';
import { ILike } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthorityMenusRepository } from './authority-menus/authority-menus.repository';
import { AdminMenu } from './admin-menus/admin-menu.entity';
import { AdminMenuRepository } from './admin-menus/admin-menu-repository';
import { AdminAccessLogRepository } from './admin-access-log/admin-access-log.repository';
import { AuthorityMenus } from './authority-menus/authority-menus.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly codeAuthorityRepository: CodeAuthorityRepository,
    private readonly authorityMenusRepository: AuthorityMenusRepository,
    private readonly adminMenuRepository: AdminMenuRepository,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly AdminAccessLogRepository: AdminAccessLogRepository,
  ) {}

  /**
   * 관리자 1건 조회
   * @param adminId
   */
  async getUser(adminId: string): Promise<AdminUser> {
    const adminUser: AdminUser | null = await this.adminUserRepository.findOne({
      relations: ['user', 'codeAuthority'],
      where: { id: adminId },
    });

    if (!adminUser) {
      throw new HttpException(
        {
          code: 'failure',
          message: '조회결과가 없습니다.',
        },
        500,
      );
    }

    return adminUser;
  }

  /**
   * 관리자 로그인
   * @param adminSignInDto
   */
  async signIn(adminSignInDto: AdminSignInDto): Promise<AdminUser> {
    const userInfo: User = await this.authService.signIn({
      providedId: adminSignInDto.email,
      password: adminSignInDto.password,
    });

    const adminUser: AdminUser | null = await this.adminUserRepository.findOne({
      where: {
        userId: userInfo.id,
      },
    });

    if (!adminUser) {
      throw new HttpException(
        { code: 'failure', message: '관리자가 존재하지 않습니다.' },
        500,
      );
    }

    const authority: CodeAuthority | null = await this.codeAuthorityRepository.findOne(
      {
        where: {
          id: adminUser.codeAuthorityId,
        },
      },
    );

    if (!authority) {
      throw new HttpException(
        { code: 'failure', message: '규칙을 설정할 수 없습니다.' },
        500,
      );
    }

    adminUser.user = userInfo;
    adminUser.codeAuthority = authority;

    return adminUser;
  }

  /**
   * 관리자 목록 조회
   * @param userFilteringDto
   * @param pageOptions
   */
  async findAdminUserPages(
    userFilteringDto: UserFilteringDto,
    pageOptions: IPaginationOptions,
  ): Promise<Pagination<AdminUser>> {
    const searchOptions: any = {
      relations: ['user', 'codeAuthority'],
      where: {
        user: {
          emailVerified: true,
        },
      },
      order: {
        user: {
          createdAt: 'DESC',
        },
      },
    };

    if (userFilteringDto.nickname) {
      searchOptions.where.user.nickaname = ILike(
        `%${userFilteringDto.nickname}%`,
      );
    }

    if (userFilteringDto.email) {
      searchOptions.where.user = {
        ...searchOptions.where.user,
        email: ILike(`%${userFilteringDto.email}%`),
      };
    }

    return await paginate<AdminUser>(
      this.adminUserRepository,
      pageOptions,
      searchOptions,
    );
  }

  /**
   * 운영자 추가/수정
   * @param adminUser
   */
  async saveAdminUser(adminUser: AdminUser): Promise<AdminUser> {
    if (!adminUser.id) {
      const adminUserCount: number = await this.adminUserRepository.count({
        where: { userId: adminUser.userId },
      });

      if (adminUserCount > 0) {
        throw new HttpException(
          { code: 'failure', message: '이미 연동된 사용자가 존재합니다.' },
          500,
        );
      }
    }

    const saveAdminUser: AdminUser = await this.adminUserRepository.save(
      adminUser,
    );

    const savedAdminUser: AdminUser | null = await this.adminUserRepository.findOne({
      relations: ['user', 'codeAuthority'],
      where: { id: saveAdminUser.id },
    });

    return savedAdminUser!;
  }

  /**
   * 관리자 연동 해제
   * @param id
   */
  async deleteAdminUse(id: string): Promise<void> {
    const removeTargetUser: AdminUser | null = await this.adminUserRepository.findOne({
      where: { id },
    });

    if (!removeTargetUser) {
      throw new HttpException(
        { code: 'failure', message: '연동 해제할 사용자가 존재하지 않습니다.' },
        500,
      );
    }

    await this.adminUserRepository.remove(removeTargetUser);
  }

  /**
   * 모든 메뉴 조회
   */
  async findAllAdminMenus(): Promise<AdminMenu[]> {
    return await this.adminMenuRepository.find();
  }

  /**
   * 모든 권한 조회
   */
  async findAllCodeAuthority(): Promise<CodeAuthority[]> {
    return await this.codeAuthorityRepository.find();
  }

  /**
   * 권한별 메뉴 조회
   * @param authorityId
   */
  async findAllCodeAuthorityMenus(
    authorityId: string,
  ): Promise<AuthorityMenus[]> {
    const authorityMenus: AuthorityMenus[] =
      await this.authorityMenusRepository.find({
        where: {
          adminMenuId: authorityId,
        },
      });

    if (!authorityMenus) {
      throw new HttpException(
        { message: '권한에 부여된 메뉴가 없습니다.', code: 'failure' },
        500,
      );
    }

    return authorityMenus;
  }
}
