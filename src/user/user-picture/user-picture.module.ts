import { Module } from '@nestjs/common';
import { UserPictureService } from './user-picture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPictureRepository } from './user-picture.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserPictureRepository])],
  controllers: [],
  providers: [UserPictureService],
})
export class UserPictureModule {}
