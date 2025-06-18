import { Module } from '@nestjs/common';
import { CodeCategoryController } from './code-category.controller';
import { CodeCategoryService } from './code-category.service';
import { CodeCategoryRepository } from './code-category.repository';
import { CustomTypeOrmModule } from '../../common/custom-type-orm.module';

@Module({
  imports: [CustomTypeOrmModule.forFeature([CodeCategoryRepository])],
  controllers: [CodeCategoryController],
  providers: [CodeCategoryService],
})
export class CodeCategoryModule {}
