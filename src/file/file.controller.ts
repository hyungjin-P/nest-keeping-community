import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file.upload.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileDeleteDto } from './dto/file.delete.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileAdminUploadDto } from './dto/file.admin-upload.dto';

@ApiTags('파일')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/')
  @ApiOperation({
    summary: '파일 S3 업로드',
    description: '파일 S3 업로드',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadObject(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() filesInfo: FileUploadDto,
  ) {
    return this.fileService.uploadFile(files, filesInfo);
  }

  @Delete('/')
  @ApiOperation({
    summary: '파일 삭제',
    description: '파일 삭제',
  })
  async deleteObject(
    @Query('tag') tag: string,
    @Query('tagInId') tagInId: string,
    @Query('url') url: string,
  ) {
    const fileInfo: FileDeleteDto = new FileDeleteDto();
    fileInfo.tag = tag;
    fileInfo.tagInId = tagInId;
    fileInfo.url = url;
    return this.fileService.deleteFile(fileInfo);
  }

  @Delete('/deleteUserBackground')
  @ApiOperation({
    summary: '파일 삭제',
    description: '파일 삭제',
  })
  async deleteFileForPost(@Query('fileUrl') fileUrl: string): Promise<void> {
    const fileInfo: FileDeleteDto = new FileDeleteDto();
    fileInfo.tag = 'user-background';
    fileInfo.url = fileUrl;
    await this.fileService.deleteFile(fileInfo);
  }

  @Post('/imageUpload')
  @UseInterceptors(FileInterceptor('image_file'))
  async ckeditorImageUploader(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    console.log('fileInfo => ', file);
    return {
      url: await this.fileService.editorFileUpload(file),
    };
  }

  @Post('importEditorImageFile')
  @UseInterceptors(FileInterceptor('image_file'))
  async importEditorImageFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    console.log('editor file upload');
  }

  @Post('/admin/filesUpload')
  @ApiOperation({
    summary: '관리자용 파일 업로드',
    description: '관리자용 파일 업로드',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async adminFileUpload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() filesInfo: FileAdminUploadDto,
  ) {
    return this.fileService.uploadFileOfAdmin(files, filesInfo);
  }
}
