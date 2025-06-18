import { Controller, Get, Query } from '@nestjs/common';
import { CodeCategoryService } from './code-category.service';
import { CodeCategory } from './code-category.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('공통 코드 카테고리')
@Controller('codeCategory')
export class CodeCategoryController {
  constructor(private codeCategoryService: CodeCategoryService) {}

  @Get('/getAll')
  @ApiOperation({
    summary: '공통 코드 카테고리 전체 조회',
    description: '공통 코드 카테고리 전체 조회',
  })
  @ApiCreatedResponse({
    description: '공통 코드 카테고리를 전체조회 한다',
    type: CodeCategory,
  })
  async getAll(): Promise<CodeCategory[]> {
    return await this.codeCategoryService.getAll();
  }

  @Get('/findById')
  @ApiOperation({
    summary: '공통 코드 카테고리 1건 조회',
    description: '공통 코드 카테고리 1건 조회',
  })
  @ApiCreatedResponse({
    description: '공통 코드 카테고리를 id로 1건 조회한다',
    type: CodeCategory,
  })
  async findById(@Query('id') id: string): Promise<CodeCategory | null> {
    return await this.codeCategoryService.findById(id);
  }
}
