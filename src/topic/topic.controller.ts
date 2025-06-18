import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TopicService } from './topic.service';
import { TopicItem } from './topic-item/topic-item.entity';

@ApiTags('주제')
@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get('/findTagList')
  @ApiOperation({
    summary: '검색하여 주제 리스트 찾기',
    description: '검색하여 주제 리스트 찾기',
  })
  async findTagList(@Query('name') name: string) {
    return await this.topicService.findTopicList(name);
  }

  @Get('/getTopicList')
  @ApiOperation({
    summary: '주제 리스트 가져오기',
    description: '주제 리스트 가져오기',
  })
  async getTopicList() {
    return await this.topicService.getTopicList();
  }

  @Post('/addTopic')
  @ApiOperation({
    summary: '주제 추가',
    description: '관리자 환경에서 주제 추가',
  })
  async createTag(
    @Query('nameKo') nameKo: string,
    @Query('nameEn') nameEn: string,
  ): Promise<TopicItem> {
    return await this.topicService.createTopic(nameKo, nameEn);
  }

  @Post('/modifyTopic')
  @ApiOperation({
    summary: '주제 수정',
    description: '관리자 환경에서 주제 수정',
  })
  async modifyTag(
    @Query('topicId') topicId: string,
    @Query('nameKo') nameKo: string,
    @Query('nameEn') nameEn: string,
  ): Promise<TopicItem> {
    return await this.topicService.modifyTopic(topicId, nameKo, nameEn);
  }

  @Delete('/deleteTopic')
  @ApiOperation({
    summary: '주제 삭제',
    description: '관리자 환경에서 주제 삭제',
  })
  async deleteTag(@Query('topicId') topicId: string) {
    return await this.topicService.deleteTopic(topicId);
  }
}
