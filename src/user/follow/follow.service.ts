import { HttpException, Injectable } from '@nestjs/common';
import { FollowRepository } from './follow.repository';
import { Follow } from './follow.entity';
import { UserService } from '../user.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from '../user.entity';
import { promises } from 'dns';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private userService: UserService,
  ) {}

  async addFollow(fromUser: string, toUser: string): Promise<Follow> {
    return await this.followRepository.save({
      fromUser: fromUser,
      toUser: toUser,
    });
  }

  async removeFollow(fromUser: string, toUser: string): Promise<any> {
    const follow: Follow | null = await this.followRepository.findOneBy({
      fromUser: fromUser,
      toUser: toUser,
    });


    if (!follow) {
      throw new HttpException(
        { code: 'failure', message: '사용자가 없습니다.' },
        500,
      );
    }else{
      return await this.followRepository.delete(follow.id);
    }
  }

  async checkFollowUser(checkUserId: string, userId: string): Promise<boolean> {
    const follow: Follow | null = await this.followRepository.findOneBy({
      fromUser: userId,
      toUser: checkUserId,
    });

    return !!follow;
  }

  async getFollowUsers(userId: string): Promise<Follow[]> {
    return await this.followRepository.findBy({ fromUser: userId });
  }

  async countFollowerAndFollowingOfUser(userId: string): Promise<any> {
    const fromUserCount = await this.followRepository.countBy({
      toUser: userId,
    });
    const toUserCount = await this.followRepository.countBy({ fromUser: userId });

    return {
      fromUserCount,
      toUserCount,
    };
  }

  /**
   * 팔로잉 조회
   * 05/25 - 로그인 유저정보 삽입
   * @param loginUserId
   * @param userId
   * @param pageOptions
   */
  async findFollowingPage(
    loginUserId: string,
    userId: string,
    pageOptions: IPaginationOptions,
  ): Promise<any> {
    const fromUserOptions: any = {
      where: {
        fromUser: userId,
      },
    };

    const fromUserPage = await paginate<Follow>(
      this.followRepository,
      pageOptions,
      fromUserOptions,
    );

    let fromUserList: User[];

    if (fromUserPage.items.length > 0) {
      const fromUserIds: string[] = fromUserPage.items.map(
        (fromUser) => fromUser.toUser,
      );

      fromUserList = [...(await this.userService.findUserIds(fromUserIds))];

      for (const user of fromUserList) {
        user.isFollow = await this.checkFollowUser(user.id, loginUserId);
      }
    }

    return {
      metaInfo: {
        meta: fromUserPage.meta,
        links: fromUserPage.links,
      },
      users: fromUserList!,
    };
  }

  /**
   * 팔로워 조회
   * 05/25 - 로그인 유저 정보 삽입
   * @param loginUserId
   * @param userId
   * @param pageOptions
   */
  async findFollowerPage(
    loginUserId: string,
    userId: string,
    pageOptions: IPaginationOptions,
  ): Promise<any> {
    const fromUserOptions: any = {
      where: {
        toUser: userId,
      },
    };

    const fromUserPage = await paginate<Follow>(
      this.followRepository,
      pageOptions,
      fromUserOptions,
    );

    let toUserList: User[];

    if (fromUserPage.items.length > 0) {
      const fromUserIds: string[] = fromUserPage.items.map(
        (fromUser) => fromUser.fromUser,
      );

      toUserList = [...(await this.userService.findUserIds(fromUserIds))];

      // 나를 좋아하는 유저를 내가 팔로우 했는지
      for (const user of toUserList) {
        user.isFollow = !!(await this.followRepository.findOneBy({
          fromUser: loginUserId,
          toUser: user.id,
        }));
      }
    }

    return {
      metaInfo: {
        meta: fromUserPage.meta,
        links: fromUserPage.links,
      },
      users: toUserList!,
    };
  }

  async isFollowed(fromUser: string, toUser: string): Promise<boolean> {
    const isFollow = await this.followRepository.findBy({ fromUser, toUser });

    return isFollow.length > 0;
  }
}
