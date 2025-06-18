import { Module } from '@nestjs/common';
import { CodeItemController } from './code-item.controller';
import { CodeItemService } from './code-item.service';
import { CodeItemRepository } from './code-item.repository';
import { CustomTypeOrmModule } from '../../common/custom-type-orm.module';

@Module({
  imports: [CustomTypeOrmModule.forFeature([CodeItemRepository])],
  controllers: [CodeItemController],
  providers: [CodeItemService],
})
export class CodeItemModule {}
