import { Controller, Get, Query } from '@nestjs/common';
import { CodeItemService } from './code-item.service';
import { CodeItem } from './code-item.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CodeCategory } from '../code-category/code-category.entity';

@ApiTags('공통 코드 아이템')
@Controller('code-item')
export class CodeItemController {
  constructor(private codeItemService: CodeItemService) {}

  @Get('/getAll')
  @ApiOperation({
    summary: '공통 코드 아이템 전체 조회',
    description: '공통 코드 아이템 전체 조회',
  })
  @ApiCreatedResponse({
    description: '공통 코드 카테고리를 전체조회 한다',
    type: CodeItem,
  })
  async getAll(): Promise<CodeItem[]> {
    return await this.codeItemService.getAll();
  }

  @Get('/findById')
  @ApiOperation({
    summary: '공통 코드 아이템 1건 조회',
    description: '공통 코드 아이템 1건 조회',
  })
  @ApiCreatedResponse({
    description: '공통 코드 아이템을 id로 1건 조회한다',
    type: CodeCategory,
  })
  async findById(@Query('id') id: string): Promise<CodeItem | null> {
    return await this.codeItemService.findById(id);
  }
}
