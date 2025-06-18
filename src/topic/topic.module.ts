import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicItemRepository } from './topic-item/topic-item.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TopicItemRepository])],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
