import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MagazineService } from '../magazine.service';
import { CodeItem } from '../../codes/code-item/code-item.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MagazineTagService } from '../magazine-tag/magazine-tag.service';
import { MagazineTagEntity } from '../magazine-tag/magazine-tag.entity';

@ApiTags('매거진(공개)')
@Controller()
export class PublicMagazineController {
  constructor(
    private magazineService: MagazineService,
    private magazineTagService: MagazineTagService,
  ) {}

  @Get('/public/magazine/findTopMagazineList')
  @ApiOperation({
    summary: '매거진 상단 뷰어 조회',
    description: '매거진 상단 뷰어 조회',
  })
  @ApiCreatedResponse({
    description: '비로그인 상태의 매거진 상단 뷰어를 조회한다.',
    type: CodeItem,
  })
  async findTopMagazineList() {
    return await this.magazineService.getTopMagazineList();
  }

  @Get('/public/magazine/findPages')
  @ApiOperation({
    summary: '매거진 페이지 조회',
    description: '매거진 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '비로그인 상태의 매거진 페이지를 조회한다.',
    type: CodeItem,
  })
  async findByPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<any>> {
    return await this.magazineService.findByPage(
      {
        page,
        limit,
        route: '/public/magazine/findPages',
      },
      category,
      pageDate,
    );
  }

  @Get('/public/magazine/findTagList')
  @ApiOperation({
    summary: '매거진 태그 조회',
    description: '매거진에 사용된 태그를 조회한다.',
  })
  @ApiCreatedResponse({
    description: '매거진에 사용된 태그를 조회한다.',
  })
  async findFeedTagList(@Query('name') name: string) {
    return await this.magazineTagService.findTagList(name);
  }

  @Get('/public/magazine/findPagesOverTag')
  @ApiOperation({
    summary: '선택된 태그로 매거진 페이지 조회',
    description: '선택된 태그로 매거진 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '선택된 태그로 피드 페이지 조회',
    type: CodeItem,
  })
  async findFeedPagesOverTag(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('tagId') tagId: string,
    @Query('pageDate') pageDate: Date,
  ): Promise<Pagination<MagazineTagEntity>> {
    return await this.magazineTagService.getMagazineListOverTag(
      { page: page, limit: limit, route: '/public/feed/findPagesOverTag' },
      tagId,
      pageDate,
    );
  }
}
