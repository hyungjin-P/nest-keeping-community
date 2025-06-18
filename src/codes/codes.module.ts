import { Module } from '@nestjs/common';
import { CodeCategoryModule } from './code-category/code-category.module';
import { CodeItemModule } from './code-item/code-item.module';

@Module({
  imports: [CodeCategoryModule, CodeItemModule],
  providers: [],
})
export class CodesModule {}
