import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommonUtil } from '../utiles/common.util';
import { EmailService } from '../services/email/email.service';
import moment from 'moment-timezone';
import { UserRegistrationDto } from './dto/user.registration.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserProfileDto } from './dto/user.profile.dto';
import { UserPasswordChangeDto } from './dto/user.password-change.dto';

import { CryptoService } from '../services/crypto/crypto.service';
import { UserResetPasswordMailDto } from './dto/user.reset-password-mail.dto';
import { UserPasswordChangeTokenDto } from './dto/user.password-change-token.dto';
import { UserPasswordChangeEmailDto } from './dto/user.password-change-email.dto';
import { UserFilteringDto } from '../admin/dto/user-filtering.dto';
import { UserWithdrawalTemporaryService } from './user-withdrawal-temporary/user-withdrawal-temporary.service';
import { UserWithdrawalTemporary } from './user-withdrawal-temporary/user-withdrawal-temporary.entity';
import { UserSearchService } from './user-search/user-search.service';

@ApiTags('사용자 정보')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userWithdrawalTemporaryService: UserWithdrawalTemporaryService,
    private readonly userSearchService: UserSearchService,
    private readonly commonUtil: CommonUtil,
    private readonly emailService: EmailService,
    private readonly cryptoService: CryptoService,
  ) {}

  @Get('/getAll')
  @ApiOperation({
    summary: '사용자 정보 전체 조회',
    description: '사용자 정보 전체 조회',
  })
  @ApiCreatedResponse({
    description: '사용자 정보를 전체조회 한다.',
    type: User,
  })
  async getAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/findById')
  // @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '사용자 id(key)로 조회',
    description: '사용자 id(key)로 조회',
  })
  @ApiCreatedResponse({
    description: '사용자를 id(key)로 1건 조회한다',
    type: User,
  })
  async findById(@Query('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Post('/modify')
  @ApiOperation({
    summary: '사용자 정보 수정',
    description: '사용자 정보 수정',
  })
  @ApiCreatedResponse({
    description: '사용자 정보를 수정한다.',
    type: User,
  })
  async modify(@Body() user: User): Promise<void> {
    await this.userService.modify(user);
  }

  @Delete('/delete')
  @ApiOperation({
    summary: '사용자 정보 삭제',
    description: '사용자 정보 삭제',
  })
  @ApiCreatedResponse({
    description: '사용자 정보를 삭제한다.',
    type: User,
  })
  async delete(@Query('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }

  @Get('/hasProvidedIdAndDeleteAtIsNull')
  @ApiOperation({
    summary: '이메일 중복 확인',
    description: '이메일 중복 확인',
  })
  @ApiCreatedResponse({
    description: '회원가입시 등록된 이메일이 존재하는지 확인한다.',
    type: User,
  })
  async hasProvidedIdAndDeleteAtIsNull(
    @Query('providedId') providedId: string,
  ): Promise<boolean> {
    return await this.userService.hasProvidedIdAndDeleteAtIsNull(providedId);
  }

  @Get('/sendVerifiedCodeMail')
  @ApiOperation({
    summary: '회원가입 이메일 인증 코드 보내기',
    description: '회원가입 이메일 인증 코드 보내기',
  })
  @ApiCreatedResponse({
    description: '이메일로 회원가입 인증 코드를 보낸다',
  })
  async sendVerificationCodeMail(
    @Query('emailAddress') emailAddress: string,
    @Query('language') language: string,
  ): Promise<any> {
    // 이메일 중복 확인
    if (await this.userService.hasProvidedIdAndDeleteAtIsNull(emailAddress)) {
      throw new HttpException(
        { code: 'failure', message: '이미 등록된 이메일이 존재합니다.' },
        200,
      );
    }

    // 인증코드 생성
    const code: number = this.commonUtil.getRandomInt(100000, 1000000);
    const codeExpiresIn = moment()
      .add(3, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss');

    // 신규 유저 임시 생성
    const user: User = new User();
    user.provider = 'keeping.link';
    user.providedId = emailAddress;
    user.email = emailAddress;
    user.emailVerificationCode = code;
    user.emailVerificationCodeExpiresin = new Date(codeExpiresIn);
    user.color = this.commonUtil.randomColor();

    await this.userService.create(user);

    return await this.emailService.sendVerificationCodeMail(
      language,
      emailAddress,
      code,
    );
  }

  @Get('/checkVerificationCode')
  @ApiOperation({
    summary: '회원가입 인증 코드 확인',
    description: '회원가입 인증 코드 확인',
  })
  @ApiCreatedResponse({
    description: '회원가입시 발송한 이메일 인증번호를 확인한다.',
  })
  async checkVerificationCode(
    @Query('providedId') providedId: string,
    @Query('verifiedCode') verifiedCode: number,
  ): Promise<void> {
    const users: User[] = await this.userService.findAllByProvidedId(
      providedId,
      verifiedCode,
    );

    if (users.length === 0) {
      throw new HttpException(
        { code: 'failure', message: '이메일 인증이 필요합니다.' },
        500,
      );
    }

    if (users[0].emailVerified) {
      throw new HttpException(
        { code: 'failure', message: '이미 가입된 이메일이 존재합니다.' },
        500,
      );
    }

    if (users[0].emailVerificationCode !== Number(verifiedCode)) {
      throw new HttpException(
        { code: 'failure', message: '인증코드가 일치하지 않습니다.' },
        500,
      );
    }

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const expiressIn = moment(users[0].emailVerificationCodeExpiresin).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    const diff = moment(expiressIn).diff(now, 'seconds');

    if (diff < 0) {
      throw new HttpException(
        { code: 'failure', message: '만료된 인증번호 입니다.' },
        500,
      );
    }
  }

  @Post('/registration')
  @ApiOperation({
    summary: '이메일 회원가입',
    description: '이메일 회원가입',
  })
  @ApiCreatedResponse({
    description: '이메일로 회원가입 한다.',
    type: User,
  })
  async registration(
    @Body() userRegistrationDto: UserRegistrationDto,
  ): Promise<User> {
    const users: User[] = await this.userService.findAllByProvidedId(
      userRegistrationDto.email,
      userRegistrationDto.verificationCode,
    );

    if (users.length === 0) {
      throw new HttpException(
        { code: 'failure', message: '인증된 사용자가 없습니다.' },
        500,
      );
    }

    return await this.userService.registration(userRegistrationDto);
  }

  @Get('/findUserPage')
  @ApiOperation({
    summary: '유저 목록 페이지 조회',
    description: '유저 목록 페이지 조회',
  })
  @ApiCreatedResponse({
    description: '유저 목록을 페이지로 조회한다.',
    type: User,
  })
  async findUserPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<User>> {
    return this.userService.getUserPage({
      page,
      limit,
      route: '/user/findUserPage',
    });
  }

  @Get('/duplicateUserNickname')
  @ApiOperation({
    summary: '유저 닉네임 중복검사',
    description: '유저 닉네임 중복검사',
  })
  @ApiCreatedResponse({
    description: '유저 닉네임을 중복검사한다.',
    type: User,
  })
  async duplicateUserNickname(
    @Query('nickName') nickName: string,
    @Query('userId') userId: string,
  ): Promise<boolean> {
    const result: boolean = await this.userService.duplicateUserNickName(
      nickName,
      userId,
    );

    if (!result) {
      throw new HttpException(
        { code: 'failure', message: '이미 사용중인 닉네임 입니다.' },
        500,
      );
    }

    return result;
  }

  @Patch('/modifyProfile')
  @ApiOperation({
    summary: '유저 프로필 수정',
    description: '유저 프로필 수정',
  })
  @ApiCreatedResponse({
    description: '유저 프로필 (넥네임, 자기소개) 수정',
    type: User,
  })
  async modifyUserProfile(
    @Body() userProfileDto: UserProfileDto,
  ): Promise<User> {
    return await this.userService.modifyUserProfile(userProfileDto);
  }

  @Patch('/changePassword')
  @ApiOperation({
    summary: '비밀번호 변경',
    description: '비밀번호 변경',
  })
  @ApiCreatedResponse({
    description: '비밀번호 변경',
    type: User,
  })
  async changePassword(
    @Body() userPasswordChangeDto: UserPasswordChangeDto,
  ): Promise<void> {
    await this.userService.changeUserPassword(userPasswordChangeDto);
  }

  @Post('/resetPasswordLinkMail')
  @ApiOperation({
    summary: '비밀번호 변경 메일 보내기',
    description: '비밀번호 변경 메일 보내기',
  })
  async sendPasswordResetMail(
    @Body() userResetPasswordMailDto: UserResetPasswordMailDto,
  ): Promise<void> {
    const user: User = await this.userService.findOneByProvidedIdOfUser(
      userResetPasswordMailDto.email,
    );

    const expiresIn = moment().add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    const cryptoObj: any = {
      userId: user.id,
      email: userResetPasswordMailDto,
      expiresIn,
      now: Date.now(),
    };

    const cryptoText: string = this.cryptoService.encrypt(cryptoObj);

    const encodeText = this.cryptoService.encodeBase64(cryptoText);

    await this.emailService.sendResetPasswordLinkMail(
      userResetPasswordMailDto.lang,
      userResetPasswordMailDto.email,
      encodeText,
    );
  }

  @Post('/passwordChangeEmailVerified')
  @ApiOperation({
    summary: '비밀번호 변경 메일 확인',
    description: '비밀번호 변경 메일 확인',
  })
  async passwordChangeEmailVerified(
    @Body() userPasswordChangeTokenDto: UserPasswordChangeTokenDto,
  ): Promise<void> {
    const token = userPasswordChangeTokenDto.token.replace(/\s/g, '+');

    const decodeText = this.cryptoService.decodeBase64(token);

    const decryptObj: any = this.cryptoService.decrypt(decodeText);

    const user: User = await this.userService.findById(decryptObj.userId);

    if (!user) {
      throw new HttpException(
        {
          code: 'user-not-found',
          message: '유효하지 않은 링크 입니다.',
        },
        500,
      );
    }

    // 만료시간 지났는 지
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const expiresIn = moment(decryptObj.expiresIn).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    const diff = moment(expiresIn).diff(now, 'seconds');

    if (diff < 0) {
      throw new HttpException(
        { code: 'time-later', message: '만료된 링크 입니다.' },
        500,
      );
    }
  }

  @Post('/passwordChangeWithVerificationCheckOk')
  @ApiOperation({
    summary: '비밀번호 변경 (검증 ok)',
    description: '비밀번호 변경',
  })
  async passwordChangeWithVerificationCheckOk(
    @Body() userPasswordChangeEmailDto: UserPasswordChangeEmailDto,
  ): Promise<User> {
    const token = userPasswordChangeEmailDto.token.replace(/\s/g, '+');

    const decodeText = this.cryptoService.decodeBase64(token);

    const decryptObj: any = this.cryptoService.decrypt(decodeText);

    const user: User = await this.userService.findById(decryptObj.userId);

    if (!user) {
      throw new HttpException(
        {
          code: 'user-not-found',
          message: '유효하지 않은 링크 입니다.',
        },
        500,
      );
    }

    // 만료시간 지났는 지
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const expiresIn = moment(decryptObj.expiresIn).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    const diff = moment(expiresIn).diff(now, 'seconds');

    if (diff < 0) {
      throw new HttpException(
        { code: 'time-later', message: '만료된 링크 입니다.' },
        500,
      );
    }

    await this.userService.changeUserPasswordEmailVerified(
      user.id,
      userPasswordChangeEmailDto.password,
    );

    return await this.userService.findById(user.id);
  }

  @Post('/findUserFilteringPages')
  @ApiOperation({
    summary: '사용자 필터링 조회',
    description: '사용자 필터링 조회',
  })
  @ApiCreatedResponse({
    description: '사용자를 필터링해서 조회한다.',
  })
  async findUserFilteringPage(
    @Body() userFilteringDto: UserFilteringDto,
  ): Promise<Pagination<User>> {
    return await this.userService.findUserFilteringPages(userFilteringDto, {
      page: userFilteringDto.page,
      limit: userFilteringDto.limit,
      route: '/admin/findPages',
    });
  }

  @Post('/withdrawalTemporary')
  @ApiOperation({
    summary: '사용자 삭제 신청',
    description: '사용자 삭제 신청',
  })
  @ApiCreatedResponse({
    description: '사용자가 삭제를 요청한다.',
  })
  async withdrawalTemporary(
    @Body() userWithdrawalDto: UserWithdrawalTemporary,
  ) {
    await this.userWithdrawalTemporaryService.saveInfo(
      userWithdrawalDto.userId,
      userWithdrawalDto.reason,
    );
    return await this.userService.softDelete(userWithdrawalDto.userId);
  }

  @Post('/withdrawalCancel')
  @ApiOperation({
    summary: '사용자 삭제 신청 취소',
    description: '사용자 삭제 신청 취소',
  })
  @ApiCreatedResponse({
    description: '사용자가 삭제취소를 요청한다.',
  })
  async withdrawalCancel(@Query('userId') userId: string) {
    await this.userWithdrawalTemporaryService.delete(userId);
    return await this.userService.softDeleteCancel(userId);
  }

  @Post('/saveSearch')
  @ApiOperation({
    summary: '사용자 검색 기록 저장',
    description: '사용자 검색 기록 저장',
  })
  @ApiCreatedResponse({
    description: '사용자 검색 기록 저장',
  })
  async saveSearchHistory(
    @Query('userId') userId: string,
    @Query('text') text: string,
  ) {
    return this.userSearchService.saveSearchHistory(userId, text);
  }

  @Delete('/deleteSearch')
  @ApiOperation({
    summary: '사용자 검색기록 개별 삭제',
    description: '사용자 검색기록 개별 삭제',
  })
  @ApiCreatedResponse({
    description: '사용자가 검색기록 개별 삭제를 요청한다.',
  })
  async deleteSearchHistory(@Query('searchId') searchId: string) {
    return this.userSearchService.deleteSearchHistory(searchId);
  }

  @Delete('/deleteSearchAll')
  @ApiOperation({
    summary: '사용자 검색기록 전체 삭제',
    description: '사용자 검색기록 전체 삭제',
  })
  @ApiCreatedResponse({
    description: '사용자가 검색기록 전체 삭제를 요청한다.',
  })
  async deleteSearchHistoryAll(@Query('userId') userId: string) {
    return this.userSearchService.deleteSearchHistoryAll(userId);
  }
}
