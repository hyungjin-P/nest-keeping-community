import { Injectable } from '@nestjs/common';
import { FeedPicture } from './feed-picture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPictureRepository } from './feed-picture.repository';
import { FileEntity } from '../../file/file.entity';

@Injectable()
export class FeedPictureService {
  constructor(
    @InjectRepository(FeedPictureRepository)
    private feedPictureRepository: FeedPictureRepository,
  ) {}

  /*
   * 아래 함수들은
   * '/file'에서 추가적인 함수 호출로 동작.
   * */

  createFeedPicture(feedId: string, uploadedFile: FileEntity[]) {
    const feedPictures = new FeedPicture[0];

    for (const file of uploadedFile) {
      const feedPicture = new FeedPicture();
      feedPicture.feedId = feedId;
      feedPicture.url = file.url;

      feedPictures.push(feedPicture);
    }
    this.feedPictureRepository.save(feedPictures);
  }

  async deleteFeedPicture(feedId: string, url: string) {
    return await this.feedPictureRepository.delete({
      feedId: feedId,
      url: url,
    });
  }
}
