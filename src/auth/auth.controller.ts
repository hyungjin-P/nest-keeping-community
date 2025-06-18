import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { UserEmailSignInDto } from './dto/user-email-sign-in.dto';
import { KakaoAccessDto } from './dto/kakao-access.dto';
import { NaverAccessDto } from './dto/naver-access.dto';
import { UserService } from '../user/user.service';
import { UserModifyServiceTermDto } from './dto/user-modify-service-term.dto';
import { GoogleAccessDto } from './dto/google-access.dto';

@Controller('auth')
@ApiTags('인증')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/signIn')
  @ApiOperation({
    summary: '이메일 로그인',
    description: '이메일 로그인',
  })
  @ApiCreatedResponse({
    description: '이메일로 로그인한다',
    type: User,
  })
  async signIn(@Body() userEmailSignInDto: UserEmailSignInDto): Promise<User> {
    return await this.authService.signIn(userEmailSignInDto);
  }

  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 로그인',
  })
  @ApiCreatedResponse({
    description: '카카오 소셜 로그인',
  })
  @Post('/kakao')
  async signInKakao(@Body() requestData: any): Promise<User> {
    return await this.authService.signInKakao(requestData.accessToken);
  }

  @ApiOperation({
    summary: '카카오 로그인 (카카오 연동해제)',
    description: '카카오 회원 탈퇴 (카카오 연동해제)',
  })
  @ApiCreatedResponse({
    description: '카카오톡 소셜 로그인 연동 해제',
  })
  @Post('/signOutKakao')
  async signOutKakao(@Body() kakaoAccessDto: KakaoAccessDto): Promise<void> {
    await this.authService.signOutKakao(kakaoAccessDto.accessToken);
  }

  @ApiOperation({
    summary: '네이버 로그인',
    description: '네이버 로그인',
  })
  @ApiCreatedResponse({
    description: '네이버 로그인',
  })
  @Post('/signInNaver')
  async signInNaver(@Body() naverAccessDto: NaverAccessDto): Promise<User> {
    return await this.authService.signInNaver(naverAccessDto.code);
  }

  @ApiOperation({
    summary: '이용약관 업데이트',
    description: '이용약관 업데이트',
  })
  @ApiCreatedResponse({
    description: '이용약관 업데이트',
  })
  @Patch('/modifyServiceTerm')
  async modifyServiceTerm(
    @Body() modifyInfo: UserModifyServiceTermDto,
  ): Promise<void> {
    await this.userService.modifyUserServiceTerm(modifyInfo);
  }

  @ApiOperation({
    summary: '구글 로그인',
    description: '구글 로그인',
  })
  @ApiCreatedResponse({
    description: '구글 로그인',
  })
  @Post('/firebaseSignIn')
  async signInGoogleLogin(
    @Body() googleAccessDto: GoogleAccessDto,
  ): Promise<User | null> {
    return await this.authService.signInGoogle(googleAccessDto);
  }
}
