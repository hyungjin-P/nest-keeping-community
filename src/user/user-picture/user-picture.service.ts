import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPictureRepository } from './user-picture.repository';
import { UserPicture } from './user-picture.entity';
import { FileEntity } from '../../file/file.entity';

@Injectable()
export class UserPictureService {
  constructor(
    @InjectRepository(UserPictureRepository)
    private userPictureRepository: UserPictureRepository,
  ) {}

  /**
   * 설정 > 유저 프로필 사진 설정, 변경
   * @param userId
   * @param uploadedFile
   */
  async createUserPicture(
    userId: string,
    uploadedFile: FileEntity[],
  ): Promise<void> {
    const userPictures = new UserPicture[0];

    // 기존 프로필 사진 삭제
    await this.userPictureRepository.delete({ userId });

    uploadedFile.forEach((file) => {
      const userPicture = new UserPicture();
      userPicture.userId = userId;
      userPicture.url = file.url;

      userPictures.push(userPicture);
    });
    await this.userPictureRepository.save(userPictures);
  }

  /**
   * 프로필 사진 삭제
   * @param url
   */
  async deleteUserPicture(url: string): Promise<void> {
    await this.userPictureRepository.delete({ url });
  }
}
