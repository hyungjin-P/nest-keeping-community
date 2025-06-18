import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminUser } from './admin-user/admin-user.entity';
import { AdminSignInDto } from './dto/admin-signIn.dto';
import { UserFilteringDto } from './dto/user-filtering.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CodeAuthority } from './code-authority/code-authority.entity';
import { AdminMenu } from './admin-menus/admin-menu.entity';

@ApiTags('관리자')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/getAdminUser')
  @ApiOperation({
    summary: '관리자 조회',
    description: '관리자 조회',
  })
  @ApiCreatedResponse({
    description: '관리자의 정보를 1건 조회한다.',
  })
  async getAdminUser(@Query('adminId') adminId: string): Promise<AdminUser> {
    return await this.adminService.getUser(adminId);
  }

  @Post('/signIn')
  @ApiOperation({
    summary: '관리자 로그인',
    description: '관리자 로그인',
  })
  @ApiCreatedResponse({
    description: '관리자 사이트 로그인',
  })
  async signIn(@Body() adminSignInDto: AdminSignInDto): Promise<AdminUser> {
    const adminUser: AdminUser = await this.adminService.signIn(adminSignInDto);
    return adminUser;
  }

  @Post('/findPages')
  @ApiOperation({
    summary: '관리자 페이징 조회',
    description: '관리자 페이징 조회',
  })
  @ApiCreatedResponse({
    description: '관리자 목록을 페이지로 조회한다.',
  })
  async findAdminUserPages(
    @Body() userFilteringDto: UserFilteringDto,
  ): Promise<Pagination<AdminUser>> {
    return await this.adminService.findAdminUserPages(userFilteringDto, {
      page: userFilteringDto.page,
      limit: userFilteringDto.limit,
      route: '/admin/findPages',
    });
  }

  @Get('/findAllCodeAuthority')
  @ApiOperation({
    summary: '권한 코드 조회',
    description: '권한 코드 조회',
  })
  @ApiCreatedResponse({
    description: '권한 코드를 조회한다.',
  })
  async findAllCodeAuthority(): Promise<CodeAuthority[]> {
    return this.adminService.findAllCodeAuthority();
  }

  @Post('/saveAdminUser')
  @ApiOperation({
    summary: '키핑 운영자 추가/수정',
    description: '키핑 운영자 추가/수정',
  })
  @ApiCreatedResponse({
    description: '키핑 운영자 추가/수정',
  })
  async saveAdminUser(@Body() adminUser: AdminUser): Promise<AdminUser> {
    if (!adminUser) {
      throw new HttpException(
        { code: 'failure', message: '잘못된 요청 입니다.' },
        500,
      );
    }
    return await this.adminService.saveAdminUser(adminUser);
  }

  @Delete('/deleteAdminUser')
  @ApiOperation({
    summary: '키핑 운영자 추가/수정',
    description: '키핑 운영자 추가/수정',
  })
  @ApiCreatedResponse({
    description: '키핑 운영자 추가/수정',
  })
  async deleteAdminUser(@Query('id') id: string): Promise<void> {
    await this.adminService.deleteAdminUse(id);
  }

  @Get('/findAllAdminMenus')
  @ApiOperation({
    summary: '관리자 메뉴 전체 조회',
    description: '관리자 메뉴 전체 조회',
  })
  @ApiCreatedResponse({
    description: '관리자 메뉴 전체 조회',
  })
  async findAllAdminMenus(): Promise<AdminMenu[]> {
    return await this.adminService.findAllAdminMenus();
  }
}
