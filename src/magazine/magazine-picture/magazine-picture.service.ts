import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MagazinePictureRepository } from './magazine_picture.repository';
import { MagazinePictureEntity } from './magazine-picture.entity';
import { FileEntity } from '../../file/file.entity';

@Injectable()
export class MagazinePictureService {
  constructor(
    @InjectRepository(MagazinePictureRepository)
    private magazinePictureRepository: MagazinePictureRepository,
  ) {}

  async createMagazinePicture(magazineId: string, uploadFiles: FileEntity[]) {
    const magazinePictures = new MagazinePictureEntity[0];
    for (const file of uploadFiles) {
      const magazinePicture = new MagazinePictureEntity();
      magazinePicture.magazineId = magazineId;
      magazinePicture.name = file.originalname;
      magazinePicture.url = file.url;

      magazinePictures.push(magazinePicture);
    }
    await this.magazinePictureRepository.save(magazinePictures);
  }

  async deleteMagazinePicture(magazineId: string, url: string) {
    return await this.magazinePictureRepository.delete({
      magazineId: magazineId,
      url: url,
    });
  }
}
