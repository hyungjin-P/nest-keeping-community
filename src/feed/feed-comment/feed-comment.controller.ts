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
import { FeedCommentService } from './feed-comment.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CodeItem } from '../../codes/code-item/code-item.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FeedComment } from './feed-comment.entity';
import { FeedCommentMentionService } from './comment-mention/comment-mention.service';
import { FeedCommentMention } from './comment-mention/comment-mention.entity';
import { FeedCommentLikeService } from './commnet-like/comment-like.service';
import { AddCommentLikeDto } from './dto/add-comment-like.dto';

@ApiTags('피드 댓글')
@Controller('/feed/comment')
export class FeedCommentController {
  constructor(
    private feedCommentService: FeedCommentService,
    private feedCommentMentionService: FeedCommentMentionService,
    private feedCommentLikeService: FeedCommentLikeService,
  ) {}

  @Get('/findPages')
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
    @Query('userId') userId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.feedCommentService.findByPageWithUserBehavior(
      {
        page,
        limit,
        route: '/feed/comment/findPages',
      },
      feedId,
      userId,
      pageDate,
    );
  }

  @Get('/sub/findPages')
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
    @Query('userId') userId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.feedCommentService.findSubByPageWithUserBehavior(
      {
        page,
        limit,
        route: '/feed/comment/sub/findPages',
      },
      feedCommentId,
      userId,
      pageDate,
    );
  }

  @Post('/create')
  @ApiOperation({
    summary: '피드 댓글 생성',
    description: '피드 댓글 생성',
  })
  async createFeedComment(
    @Body() feedComment: FeedComment,
  ): Promise<FeedComment> {
    return await this.feedCommentService.createFeedComment(feedComment);
  }

  @Post('/modify')
  @ApiOperation({
    summary: '피드 댓글 수정',
    description: '피드 댓글 수정',
  })
  async modifyFeedComment(
    @Query('feedCommentId') feedCommentId: string,
    @Query('text') text: string,
  ): Promise<FeedComment> {
    return await this.feedCommentService.modifyFeedComment(feedCommentId, text);
  }

  @Delete('/delete')
  @ApiOperation({
    summary: '피드 댓글 삭제',
    description: '피드 댓글 삭제',
  })
  async deleteFeedComment(
    @Query('feedCommentId') feedCommentId: string,
  ): Promise<FeedComment> {
    return await this.feedCommentService.deleteFeedComment(feedCommentId);
  }

  @Delete('/remove')
  @ApiOperation({
    summary: '피드 댓글 물리적 삭제',
    description: '피드 댓글 물리적 삭제',
  })
  async removeFeedComment(
    @Query('feedCommentId') feedCommentId: string,
  ): Promise<void> {
    return await this.feedCommentService.removeFeedComment(feedCommentId);
  }

  @Post('/addMention')
  @ApiOperation({
    summary: '피드 댓글 언급 추가',
    description: '피드 댓글 언급 추가',
  })
  async createCommentMention(
    @Body() mention: FeedCommentMention,
  ): Promise<FeedCommentMention> {
    return await this.feedCommentMentionService.addMention(mention);
  }

  @Delete('/deleteMention')
  @ApiOperation({
    summary: '피드 댓글 언급 삭제',
    description: '피드 댓글 언급 삭제',
  })
  async deleteCommentMention(@Query('mentionId') mentionId: string) {
    return await this.feedCommentMentionService.deleteMention(mentionId);
  }

  @Post('/addLike')
  @ApiOperation({
    summary: '댓글 좋아요 추가',
    description: '댓글 좋아요 추가',
  })
  async createCommentLike(
    @Query('feedCommentId') feedCommentId: string,
    @Query('userId') userId: string,
  ): Promise<number> {
    return await this.feedCommentLikeService.createLike(feedCommentId, userId);
  }

  @Post('/addLikeAndGetComment')
  @ApiOperation({
    summary: '댓글 좋아요 추가',
    description: '댓글 좋아요 추가 및 해당 데이터 리턴',
  })
  async createCommentLikeAndReturnThisValue(
    @Body() addCommentLikeDto: AddCommentLikeDto,
  ): Promise<any> {
    return await this.feedCommentLikeService.createLikeAndReturnComment(
      addCommentLikeDto.feedCommentId,
      addCommentLikeDto.userId,
    );
  }

  @Delete('/deleteLike')
  @ApiOperation({
    summary: '댓글 좋아요 취소',
    description: '댓글 좋아요 취소',
  })
  async deleteCommentLike(
    @Query('feedCommentId') feedCommentId: string,
    @Query('userId') userId: string,
  ): Promise<number> {
    return await this.feedCommentLikeService.deleteLike(feedCommentId, userId);
  }

  @Get('/getFeedCommentsWithRelations')
  @ApiOperation({
    summary: '댓글 조회',
    description: '댓글 조회',
  })
  async findFeedCommentWithRelations(
    @Query('feedId') feedId: string,
  ): Promise<FeedComment[]> {
    return await this.feedCommentService.findFeedCommentWithRelations(feedId);
  }
}
