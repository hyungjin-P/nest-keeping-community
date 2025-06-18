import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBackgroundRepository } from './user-background.repository';
import { FileEntity } from '../../file/file.entity';
import { UserBackground } from './user-background.entity';

@Injectable()
export class UserBackgroundService {
  constructor(
    @InjectRepository(UserBackgroundRepository)
    private userBackgroundRepository: UserBackgroundRepository,
  ) {}

  /**
   * 마이페이지 유저 배경화면 설정, 변경
   * @param userId
   * @param uploadedFile => File[]
   */
  async createUserBackground(
    userId: string,
    uploadedFile: FileEntity[],
  ): Promise<void> {
    const userBackgrounds = new UserBackground[0];

    // 기존 백그라운드 이미지 삭제
    await this.userBackgroundRepository.delete({ userId });

    uploadedFile.forEach((file) => {
      const userBackground = new UserBackground();
      userBackground.userId = userId;
      userBackground.url = file.url;

      userBackgrounds.push(userBackground);
    });
    await this.userBackgroundRepository.save(userBackgrounds);
  }

  /**
   * 파일 삭제
   * @param url
   */
  async deleteUserBackground(url: string): Promise<void> {
    await this.userBackgroundRepository.delete({ url });
  }
}
