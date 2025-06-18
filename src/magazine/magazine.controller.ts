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
import { Magazine } from './magazine.entity';
import { MagazineService } from './magazine.service';
import { CodeCategory } from '../codes/code-category/code-category.entity';
import { MagazineModifyDto } from './dto/magazine.modify.dto';
import { MagazineTagService } from './magazine-tag/magazine-tag.service';
import { MagazineLikeService } from './magazine-like/magazine-like.service';
import { MagazineTagEntity } from './magazine-tag/magazine-tag.entity';
import { CodeItem } from '../codes/code-item/code-item.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MagazineViewsService } from './magazine-views/magazine-views.service';
import { MagazineBookmarkService } from './magazine-bookmark/magazine-bookmark.service';

@ApiTags('매거진')
@Controller('magazine')
export class MagazineController {
  constructor(
    private readonly magazineService: MagazineService,
    private readonly magazineTagService: MagazineTagService,
    private readonly magazineLikeService: MagazineLikeService,
    private readonly magazineViewService: MagazineViewsService,
    private readonly magazineBookmarkService: MagazineBookmarkService,
  ) {}

  @Get('/findTopMagazineList')
  @ApiOperation({
    summary: '매거진 상단 뷰어 조회',
    description: '매거진 상단 뷰어 조회',
  })
  @ApiCreatedResponse({
    description: '로그인 상태의 매거진 상단 뷰어를 조회한다.',
    type: CodeItem,
  })
  async findTopMagazineList(@Query('userId') userId: string) {
    return await this.magazineService.getTopMagazineList(userId);
  }

  @Get('/findPages')
  @ApiOperation({
    summary: '매거진 페이지 조회',
    description: '매거진 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '로그인 상태의 매거진 페이지를 조회한다.',
    type: CodeItem,
  })
  async findByPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category: string,
    @Query('userId') userId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.magazineService.findByPageWithUserBehavior(
      {
        page,
        limit,
        route: '/magazine/findPages',
      },
      category,
      userId,
      pageDate,
    );
  }

  @Get('/findPagesOverBookmark')
  @ApiOperation({
    summary: '매거진 북마크 페이지 조회',
    description: '매거진 북마크 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '북마크한 매거진을 페이지 형식으로 조회한다.',
    type: CodeItem,
  })
  async findMagazinePageOverBookmark(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('userId') userId: string,
  ): Promise<Pagination<any>> {
    return await this.magazineBookmarkService.getMagazineOverBookmark(
      { page, limit, route: '/magazine/findPagesOverBookmark' },
      userId,
    );
  }

  @Post('/create')
  @ApiOperation({
    summary: '매거진 생성',
    description: '매거진 생성',
  })
  async createMagazine(@Body() magazine: Magazine, @Query() rewrite: boolean) {
    magazine.rewrite = rewrite;
    return this.magazineService.create(magazine);
  }

  @Post('/modify')
  @ApiOperation({
    summary: '매거진 수정',
    description: '매거진 1건 수정',
  })
  @ApiCreatedResponse({
    description: '매거진 1건 수정',
    type: CodeCategory,
  })
  async modifyMagazine(
    @Body() magazine: MagazineModifyDto,
    @Query('magazineId') magazineId: string,
  ) {
    return await this.magazineService.modify(magazineId, magazine);
  }

  @Delete('/delete')
  @ApiOperation({
    summary: '매거진 삭제',
    description: '매거진 삭제',
  })
  @ApiCreatedResponse({
    description: '매거진 1건 삭제',
    type: CodeCategory,
  })
  async deleteMagazine(@Query('magazineId') magazineId: string): Promise<void> {
    return await this.magazineService.delete(magazineId);
  }

  @Post('/addTag')
  @ApiOperation({
    summary: '매거진 태그 추가',
    description: '매거진 태그 추가',
  })
  async addMagazineTag(
    @Query('magazineId') magazineId: string,
    @Query('nameKo') nameKo: string,
    @Query('nameEn') nameEn: string,
  ): Promise<MagazineTagEntity> {
    return await this.magazineTagService.addTag(magazineId, nameKo, nameEn);
  }

  @Delete('/deleteTag')
  @ApiOperation({
    summary: '매거진 태그 삭제',
    description: '매거진 태그 삭제',
  })
  async deleteMagazineTag(
    @Query('magazineId') magazineId: string,
    @Query('tagId') tagId: string,
  ) {
    return await this.magazineTagService.deleteTag(magazineId, tagId);
  }

  @Post('/addLike')
  @ApiOperation({
    summary: '매거진 좋아요 추가',
    description: '매거진 좋아요 추가',
  })
  async createMagazineLike(
    @Query('magazineId') magazineId: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return await this.magazineLikeService.createLike(magazineId, userId);
  }

  @Get('/findLikePage')
  @ApiOperation({
    summary: '매거진 좋아요 조회',
    description: '매거진 좋아요 목록 조회',
  })
  async getMagazineLike(
    @Query('magazineId') magazineId: string,
  ): Promise<any[]> {
    return await this.magazineLikeService.findById(magazineId);
  }

  @Delete('/deleteLike')
  @ApiOperation({
    summary: '매거진 좋아요 삭제',
    description: '매거진 좋아요 취소',
  })
  async deleteMagazineLike(
    @Query('magazineId') magazineId: string,
    @Query('userId') userId: string,
  ) {
    return await this.magazineLikeService.deleteLike(magazineId, userId);
  }

  @Post('/addView')
  @ApiOperation({
    summary: '매거진 조회수 추가',
    description: '매거진 조회수 추가',
  })
  async createMagazineView(
    @Query('magazineId') magazineId: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    return await this.magazineViewService.createView(magazineId, userId);
  }

  @Post('/addBookmark')
  @ApiOperation({
    summary: '매거진 북마크 추가',
    description: '매거진 북마크 추가',
  })
  async createMagazineBookmark(
    @Query('magazineId') magazineId: string,
    @Query('userId') userId: string,
  ) {
    return await this.magazineBookmarkService.createBookmark(
      magazineId,
      userId,
    );
  }

  @Delete('/deleteBookmark')
  @ApiOperation({
    summary: '매거진 북마크 삭제',
    description: '매거진 북마크 삭제',
  })
  async deleteMagazineBookmark(
    @Query('magazineId') magazineId: string,
    @Query('userId') userId: string,
  ) {
    return await this.magazineBookmarkService.deleteBookmark(
      magazineId,
      userId,
    );
  }

  @Delete('/deleteAllBookmarkByUserId')
  @ApiOperation({
    summary: '매거진 북마크 전체삭제',
    description: '매거진 북마크 전체삭제',
  })
  async deleteMagazineBookmarkAll(@Query('userId') userId: string) {
    return await this.magazineBookmarkService.deleteAllBookmark(userId);
  }
}
