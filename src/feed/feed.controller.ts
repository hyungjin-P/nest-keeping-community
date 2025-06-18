import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Feed } from './feed.entity';
import { FeedService } from './feed.service';
import { FeedModifyDto } from './dto/feed.modify.dto';
import { FeedTag } from './feed-tag/feed-tag.entity';
import { FeedTagService } from './feed-tag/feed-tag.service';
import { FeedLikeService } from './feed-like/feed-like.service';
import { CodeCategory } from '../codes/code-category/code-category.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CodeItem } from '../codes/code-item/code-item.entity';
import { FeedLikeDto } from './dto/feed-like.dto';
import { FeedBookmarkDto } from './dto/feed-bookmark.dto';
import { FeedBookmarkService } from './feed-bookmark/feed-bookmark.service';
import { MypageFeedMainDto } from './dto/mypage-feed-main.dto';
import { FindFeedEntity } from './feed-dao/find-feed.entity';
import { FeedFilteringDto } from './dto/feed.filtering.dto';
import { FeedTopicService } from './feed-topic/feed-topic.service';

@ApiTags('피드')
@Controller('feed')
export class FeedController {
  constructor(
    private feedService: FeedService,
    private feedTagService: FeedTagService,
    private feedLikeService: FeedLikeService,
    private feedBookmarkService: FeedBookmarkService,
    private feedTopicService: FeedTopicService,
  ) {}

  @Get('/findPages')
  @ApiOperation({
    summary: '피드 페이지 조회',
    description: '피드 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '피드 페이지를 조회한다.',
    type: CodeItem,
  })
  async findFeedPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userId') userId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.feedService.findByPageWithUserBehavior(
      {
        page,
        limit,
        route: '/feed/findPages',
      },
      userId,
      pageDate,
    );
  }

  @Get('/findPagesOverFollow')
  @ApiOperation({
    summary: '피드 팔로우 페이지 조회',
    description: '피드 팔로우 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '팔로우 한 인원의 피드를 페이지 형식으로 조회한다.',
    type: CodeItem,
  })
  async findFeedPageOverFollow(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userId') userId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.feedService.findByPageOverFollow(
      {
        page,
        limit,
        route: '/feed/findPagesOverFollow',
      },
      userId,
      pageDate,
    );
  }

  @Get('/findPagesOverBookmark')
  @ApiOperation({
    summary: '피드 북마크 페이지 조회',
    description: '피드 북마크 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '북마크한 피드를 페이지 형식으로 조회한다.',
    type: CodeItem,
  })
  async findFeedPageOverBookmark(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userId') userId: string,
  ) {
    return await this.feedBookmarkService.getFeedListOverBookmark(
      { page, limit, route: '/feed/findPagesOverBookmark' },
      userId,
    );
    /*return await this.feedService.findByPageOverBookmark(
      { page, limit, route: '/feed/findPagesOverBookmark' },
      userId,
    );*/
  }

  @Get('/findById')
  @ApiOperation({
    summary: '피드 1건 상세 조회',
    description: '피드 1건 상세 조회',
  })
  @ApiCreatedResponse({
    description: '피드 1건을 상세조회 한다.',
    type: CodeCategory,
  })
  async findByPublicFeedById(
    @Query('feedId') feedId: string,
    @Query('userId') userId: string,
  ): Promise<Feed[]> {
    return await this.feedService.findByFeedIdWithUserBehavior(feedId, userId);
  }

  @Post('/createFeed')
  @ApiOperation({
    summary: '피드 생성',
    description: '피드 생성',
  })
  async createFeed(
    @Query('rewrite') rewrite: string,
    @Query('userId') userId: string,
  ): Promise<Feed> {
    return await this.feedService.createFeed(rewrite, userId);
  }

  @Post('/updateFeed')
  @ApiOperation({
    summary: '피드 수정',
    description: '피드 수정',
  })
  @ApiCreatedResponse({
    description: '피드 1건 수정',
    type: CodeCategory,
  })
  async updateFeed(@Body() feedModifyDto: FeedModifyDto): Promise<Feed> {
    return await this.feedService.updateFeed(
      feedModifyDto.feedId,
      feedModifyDto,
    );
  }

  @Post('/modifyFeed')
  async modifyFeed(@Body() feed: Feed) {
    return await this.feedService.modifyFeed(feed);
  }

  @Post('/modifyFeedPicture')
  async modifyFeedPicture(@Body() feed: Feed) {
    return await this.feedService.modifyFeedOnPictures(feed);
  }

  @Delete('/deleteFeed')
  @ApiOperation({
    summary: '피드 삭제',
    description: '피드 삭제',
  })
  @ApiCreatedResponse({
    description: '피드 1건 삭제',
    type: CodeCategory,
  })
  async deleteFeed(@Query('feedId') feedId: string): Promise<void> {
    return await this.feedService.deleteFeed(feedId);
  }

  @Post('/addFeedTag')
  @ApiOperation({
    summary: '피드 태그 추가',
    description: '피드 태그 추가',
  })
  async createFeedTag(
    @Query('feedId') feedId: string,
    @Query('name') name: string,
  ): Promise<FeedTag> {
    return await this.feedTagService.addFeedTag(feedId, name);
  }

  @Delete('/deleteFeedTag')
  @ApiOperation({
    summary: '피드 태그 삭제',
    description: '피드 태그 삭제',
  })
  async deleteFeedTag(
    @Query('feedId') feedId: string,
    @Query('tagId') tagId: string,
  ) {
    return await this.feedTagService.deleteFeedTag(feedId, tagId);
  }

  /* 태그 업데이트 이후 삭제, 기존 태그 추가, 삭제 이벤트 */
  @Post('/addFeedTagNameOnly')
  @ApiOperation({
    summary: '피드 태그 추가',
    description: '피드 태그 추가',
  })
  async createFeedTagNameOnly(
    @Query('feedId') feedId: string,
    @Query('name') name: string,
  ): Promise<FeedTag> {
    return await this.feedTagService.addFeedTagNameOnly(feedId, name);
  }

  @Delete('/deleteFeedTagNameOnly')
  @ApiOperation({
    summary: '피드 태그 삭제',
    description: '피드 태그 삭제',
  })
  async deleteFeedTagNameOnly(
    @Query('feedId') feedId: string,
    @Query('tagId') tagId: string,
  ) {
    return await this.feedTagService.deleteFeedTagNameOnly(feedId, tagId);
  }

  @Get('/like/findPages')
  @ApiOperation({
    summary: '피드 좋아요 조회',
    description: '피드 좋아요 조회',
  })
  @ApiCreatedResponse({
    description: '피드 좋아요를 페이지 형식으로 조회한다.',
    type: CodeItem,
  })
  async findFeedLikePage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('feedId') feedId: string,
    @Query('userId') userId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.feedService.findByLikePageWithUserBehavior(
      {
        page,
        limit,
        route: '/feed/like/findPages',
      },
      feedId,
      userId,
      pageDate,
    );
  }

  @Post('/addLike')
  @ApiOperation({
    summary: '피드 좋아요 추가',
    description: '피드 좋아요 추가',
  })
  async createFeedLike(@Body() feedLikeDto: FeedLikeDto): Promise<number> {
    return await this.feedLikeService.createFeedLike(
      feedLikeDto.feedId,
      feedLikeDto.userId,
    );
  }

  @Delete('/deleteLike')
  @ApiOperation({
    summary: '피드 좋아요 취소',
    description: '피드 좋아요 취소',
  })
  async deleteFeedLike(
    @Query('feedId') feedId: string,
    @Query('userId') userId: string,
  ): Promise<number> {
    return await this.feedLikeService.deleteFeedLike(feedId, userId);
  }

  @Post('/addBookmark')
  @ApiOperation({
    summary: '피드 북마크 추가',
    description: '피드 북마크 추가',
  })
  @ApiCreatedResponse({
    description: '북마크를 추가한다',
    type: CodeCategory,
  })
  async addBookmark(@Body() feedBookmarkDto: FeedBookmarkDto): Promise<void> {
    await this.feedBookmarkService.addBookmark(feedBookmarkDto);
  }

  @Delete('/deleteBookmark')
  @ApiOperation({
    summary: '피드 북마크 삭제',
    description: '피드 북마크 삭제',
  })
  @ApiCreatedResponse({
    description: '북마크를 삭제한다',
    type: CodeCategory,
  })
  async deleteBookmark(
    @Query('feedId') feedId: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    await this.feedBookmarkService.deleteBookmark({ feedId, userId });
  }

  @Get('/findMypageFeed')
  @ApiOperation({
    summary: '마이페이지 피드 메인 조회',
    description: '마이페이지 피드 메인 조회',
  })
  @ApiCreatedResponse({
    description: '마이페이지내 피드 메인에 표시되는 피드를 조회한다.',
  })
  async findMyPageFeed(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('userId') userId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<Feed>> {
    return await this.feedService.findMyPageFeedList(
      {
        page,
        limit,
        route: '/feed/findMypageFeed',
      },
      userId,
      pageDate,
    );
  }

  @Delete('/deleteAllBookmarkByUserId')
  @ApiOperation({
    summary: '피드 북마크 전체삭제',
    description: '피드 북마크 전체삭제',
  })
  async deleteFeedBookmarkAll(@Query('userId') userId: string) {
    return await this.feedBookmarkService.deleteAllBookmarkOfUser(userId);
  }

  @Get('/findMypageFeedDetail')
  @ApiOperation({
    summary: '마이페이지 피드 상세 조회',
    description: '마이페이지 피드 상세 조회',
  })
  @ApiCreatedResponse({
    description: '마이페이지내 피드 메인에 표시되는 피드를 조회한다.',
  })
  async findMyPageFeedDetail(
    @Query('userId') userId: string,
    @Query('otherUserId', new DefaultValuePipe(null)) otherUserId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<FindFeedEntity>> {
    let feedDetailPage: Pagination<FindFeedEntity>;

    if (!otherUserId) {
      feedDetailPage = await this.feedService.findFeedDetailPage(
        {
          page,
          limit,
          route: '/feed/findMypageFeedDetail',
        },
        userId,
        pageDate,
      );
    } else {
      feedDetailPage = await this.feedService.findFeedOtherUserPage(
        {
          page,
          limit,
          route: '/feed/findMypageFeedDetail',
        },
        userId,
        otherUserId,
      );
    }

    return feedDetailPage;
  }

  @Get('/findMypageFeedDetailTest')
  @ApiOperation({
    summary: '마이페이지 피드 상세 테스트',
  })
  @ApiCreatedResponse({
    description: '페이징 테스트 ',
  })
  async findMyPageFeedDetailTest(
    @Query('userId') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<FindFeedEntity>> {
    return await this.feedService.findFeedDetailPage(
      { page, limit, route: '/feed/findMypageFeedDetail' },
      userId,
      pageDate,
    );
  }

  @Delete('/realDelete')
  @ApiOperation({
    summary: '피드 1건 삭제 (물리적)',
    description: '피드 1건 삭제 (물리적)',
  })
  @ApiCreatedResponse({
    description: '피드 1건을 물리적으로 삭제한다.',
  })
  async deleteRealFeed(@Query('feedId') feedId: string): Promise<void> {
    await this.feedService.deleteRealFeed(feedId);
  }

  @Post('/filteredFeedPages')
  @ApiOperation({
    summary: '피드 조회 (필터링)',
    description: '피드를 필터링 하여 검색한다.',
  })
  @ApiCreatedResponse({
    description: '피드 필터링 검색',
  })
  async filteredFeedPages(
    @Body() feedFilteringDto: FeedFilteringDto,
  ): Promise<void | Pagination<FindFeedEntity>> {
    return await this.feedService.findFilteredFeedPages(feedFilteringDto, {
      page: feedFilteringDto.page,
      limit: feedFilteringDto.limit,
      route: '/feed/findMypageFeedDetail',
    });
  }

  /* Topic Controller */
  @Post('/addTopic')
  @ApiOperation({
    summary: '피드 주제 추가',
    description: '피드에 주제를 추가한다',
  })
  @ApiCreatedResponse({
    description: '피드 주제 추가',
  })
  async addTopic(
    @Query('feedId') feedId: string,
    @Query('topicId') topicId: string,
  ) {
    return await this.feedTopicService.addTopic(feedId, topicId);
  }

  @Delete('/deleteTopic')
  @ApiOperation({
    summary: '피드 주제 삭제',
    description: '피드에 주제를 삭제한다',
  })
  @ApiCreatedResponse({
    description: '피드 주제 삭제',
  })
  async deleteTopic(@Query('topicId') topicId: string) {
    return await this.feedTopicService.deleteTopic(topicId);
  }

  //주제 필터링 검색
}
