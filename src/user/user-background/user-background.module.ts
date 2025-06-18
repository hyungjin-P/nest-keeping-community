import { Module } from '@nestjs/common';
import { UserBackgroundService } from './user-background.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBackgroundRepository } from './user-background.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserBackgroundRepository])],
  controllers: [],
  providers: [UserBackgroundService],
})
export class UserBackgroundModule {}
