import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './file.repository';
import { FileTagRepository } from './file-tag.repository';
import { FeedPictureService } from '../feed/feed-picture/feed-picture.service';
import { FeedPictureRepository } from '../feed/feed-picture/feed-picture.repository';
import { UserBackgroundRepository } from '../user/user-background/user-background.repository';
import { UserBackgroundService } from '../user/user-background/user-background.service';
import { UserPictureRepository } from '../user/user-picture/user-picture.repository';
import { UserPictureService } from '../user/user-picture/user-picture.service';
import { MagazinePictureService } from '../magazine/magazine-picture/magazine-picture.service';
import { MagazinePictureRepository } from '../magazine/magazine-picture/magazine_picture.repository';
import { MagazineRepository } from '../magazine/magazine.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileRepository,
      FileTagRepository,
      FeedPictureRepository,
      UserBackgroundRepository,
      UserPictureRepository,
      MagazinePictureRepository,
      MagazineRepository,
    ]),
  ],
  providers: [
    FileService,
    FeedPictureService,
    UserBackgroundService,
    UserPictureService,
    MagazinePictureService,
  ],
  controllers: [FileController],
  exports: [
    FileService,
    UserBackgroundService,
    UserPictureService,
    MagazinePictureService,
    TypeOrmModule.forFeature([
      FileRepository,
      FileTagRepository,
      UserBackgroundRepository,
      UserPictureRepository,
      MagazinePictureRepository,
      MagazineRepository,
    ]),
  ],
})
export class FileModule {}
