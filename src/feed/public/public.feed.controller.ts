import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedService } from '../feed.service';
import { Feed } from '../feed.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CodeItem } from '../../codes/code-item/code-item.entity';
import { CodeCategory } from '../../codes/code-category/code-category.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FeedCommentService } from '../feed-comment/feed-comment.service';
import { LocalAuthGuard } from '../../auth/guards/local-auth-guard';
import { FindFeedEntity } from '../feed-dao/find-feed.entity';
import { FeedTagService } from '../feed-tag/feed-tag.service';

@ApiTags('피드(공개)')
@Controller()
export class PublicFeedController {
  constructor(
    private feedService: FeedService,
    private feedCommentService: FeedCommentService,
    private feedTagService: FeedTagService,
  ) {}

  @Get('/public/feed/findPages')
  @ApiOperation({
    summary: '피드 페이지 조회',
    description: '피드 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '피드 페이지를 조회한다.',
    type: CodeItem,
  })
  async findByPublicFeedPages(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.feedService.findByPage(
      {
        page,
        limit,
        route: '/public/feed/findPages',
      },
      pageDate,
    );
  }

  @Get('/public/feed/findPageAll')
  @ApiOperation({
    summary: '관리자 피드 페이지 조회',
    description: '관리자 피드 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '관리자 페이지 피드 페이지 조회',
  })
  async findByPublicFeedPageAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<any>> {
    return await this.feedService.findByPageAll({
      page,
      limit,
      route: '/public/feed/findPageAll',
    });
  }

  @Get('/public/authFeed')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: '피드 테스트',
    description: '피드 테스트',
  })
  @ApiCreatedResponse({
    description: '피드 권한 테스트',
    type: CodeItem,
  })
  @ApiBearerAuth('accessToken')
  async authFeed(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    /*return await this.feedService.findByPage({
      page,
      limit,
      route: '/public/authFeed',
    });*/
  }

  @Get('/public/feed/findById')
  @ApiOperation({
    summary: '피드 1건 상세 조회',
    description: '피드 1건 상세 조회',
  })
  @ApiCreatedResponse({
    description: '피드 1건을 상세조회한다.',
    type: CodeCategory,
  })
  async findByPublicFeedById(@Query('feedId') feedId: string): Promise<Feed[]> {
    return await this.feedService.findByFeedId(feedId);
  }

  @Get('/public/feed/findPagesUnderDate')
  @ApiOperation({
    summary: '피드 상세 하단 피드페이지 형식 조회',
    description: '피드 상세 하단 피드페이지 형식 조회',
  })
  @ApiCreatedResponse({
    description: '피드 상세 하단 피드목록을 페이지 형식으로 조회한다.',
    type: CodeItem,
  })
  async findPublicFeedPagesUnderDate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('feedId') feedId: string,
  ) {
    return await this.feedService.findByPageUnderDate(
      {
        page,
        limit,
        route: '/public/feed/findPagesUnderDate',
      },
      feedId,
    );
  }

  @Get('/public/feed/like/findPages')
  @ApiOperation({
    summary: '피드 좋아요 조회',
    description: '피드 좋아요 조회',
  })
  @ApiCreatedResponse({
    description: '피드 좋아요를 페이지형식으로 조회한다.',
    type: CodeItem,
  })
  async findFeedLikePage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('feedId') feedId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.feedService.findByLikePage(
      {
        page,
        limit,
        route: '/public/feed/like/findPages',
      },
      feedId,
      pageDate,
    );
  }

  @Get('/public/feed/comment/findPages')
  @ApiOperation({
    summary: '피드 댓글 조회',
    description: '피드 댓글 조회',
  })
  @ApiCreatedResponse({
    description: '댓글을 페이지 별로 조회한다.',
    type: CodeItem,
  })
  async findFeedCommentPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('feedId') feedId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.feedCommentService.findByPage(
      {
        page,
        limit,
        route: '/public/feed/comment/findPages',
      },
      feedId,
      pageDate,
    );
  }

  @Get('/public/feed/comment/sub/findPages')
  @ApiOperation({
    summary: '대댓글 조회',
    description: '피드 대댓글 조회',
  })
  @ApiCreatedResponse({
    description: '대댓글을 페이지 별로 조회한다.',
    type: CodeItem,
  })
  async findFeedSubCommentPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('feedCommentId') feedCommentId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.feedCommentService.findSubByPage(
      {
        page,
        limit,
        route: '/public/feed/comment/sub/findPages',
      },
      feedCommentId,
      pageDate,
    );
  }

  @Get('/public/feed/findOneWithRelations')
  @ApiOperation({
    summary: '피드 및 연관 테이블 조회',
    description: '피드 및 연관 테이블 조회',
  })
  @ApiCreatedResponse({
    description: '피드 및 연관 테이블을 조회한다.',
  })
  async findOneFeedWithRelations(
    @Query('userId') userId: string,
  ): Promise<FindFeedEntity[]> {
    return await this.feedService.findAllFeedWithRelationsForUser(userId);
  }

  @Get('/public/feed/findTagList')
  @ApiOperation({
    summary: '피드 태그 조회',
    description: '피드에 사용된 태그를 조회한다.',
  })
  @ApiCreatedResponse({
    description: '피드에 사용된 태그를 조회한다.',
  })
  async findFeedTagList(@Query('name') name: string) {
    return await this.feedTagService.findTagList(name);
  }

  @Get('/public/feed/findPagesOverTag')
  @ApiOperation({
    summary: '선택된 태그로 피드 페이지 조회',
    description: '선택된 태그로 피드 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '선택된 태그로 피드 페이지 조회',
    type: CodeItem,
  })
  async findFeedPagesOverTag(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('name') name: string,
    @Query('pageDate') pageDate: Date,
  ) {
    return await this.feedTagService.getFeedListOverTag(
      { page: page, limit: limit, route: '/public/feed/findPagesOverTag' },
      name,
      pageDate,
    );
  }
}
