import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { Follow } from './follow.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user.entity';

@ApiTags('팔로우')
@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  /**
   * 팔로우 추가
   * @param fromUser 로그인 유저
   * @param toUser 팔로우 할 유저
   */
  @Post('/addFollow')
  async addFollow(
    @Query('fromUser') fromUser: string,
    @Query('toUser') toUser: string,
  ): Promise<Follow> {
    return await this.followService.addFollow(fromUser, toUser);
  }

  @Delete('/removeFollow')
  async removeFollow(
    @Query('fromUser') fromUser: string,
    @Query('toUser') toUser: string,
  ): Promise<any> {
    return await this.followService.removeFollow(fromUser, toUser);
  }

  @Get('/countFollow')
  @ApiOperation({
    summary: '유저의 팔로워 수 조회',
    description: '유저의 팔로워 수 조회',
  })
  @ApiCreatedResponse({
    description: '유저의 팔로워 수를 조회한다.',
  })
  async countFollowerAndFollowing(
    @Query('userId') userId: string,
  ): Promise<any> {
    return await this.followService.countFollowerAndFollowingOfUser(userId);
  }

  @Get('/findFollowing')
  @ApiOperation({
    summary: '유저의 팔로잉 조회',
    description: '유저의 팔로워 수 조회',
  })
  async findFollowingPage(
    @Query('loginUserId') loginUserId: string,
    @Query('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<User[]> {
    // 05/25 로그인 유저 정보 삽입
    const users: User[] = await this.followService.findFollowingPage(
      loginUserId,
      userId,
      {
        page,
        limit,
        route: '/follow/findFollowing',
      },
    );

    return users;
  }

  @Get('/findFollower')
  @ApiOperation({
    summary: '유저의 팔로워 조회',
    description: '유저의 팔로워 수 조회',
  })
  async findFollowerPage(
    @Query('loginUserId') loginUserId: string,
    @Query('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<User[]> {
    // 05/25 로그인 유저정보 삽입
    const users: User[] = await this.followService.findFollowerPage(
      loginUserId,
      userId,
      {
        page,
        limit,
        route: '/follow/findFollower',
      },
    );
    return users;
  }

  @Get('/isFollowed')
  @ApiOperation({
    summary: '유저의 팔로워 수 조회',
    description: '유저의 팔로워 수 조회',
  })
  @ApiCreatedResponse({
    description: '유저의 팔로워 수를 조회한다.',
  })
  async isFollowed(
    @Query('fromUser') fromUser: string,
    @Query('toUser') toUser: string,
  ): Promise<boolean> {
    return await this.followService.isFollowed(fromUser, toUser);
  }
}
