import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEmailSignInDto } from './dto/user-email-sign-in.dto';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { UserPictureRepository } from '../user/user-picture/user-picture.repository';
import { UserBackgroundRepository } from '../user/user-background/user-background.repository';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CommonUtil } from '../utiles/common.util';
import { UserPicture } from '../user/user-picture/user-picture.entity';
import { UserBackground } from '../user/user-background/user-background.entity';
import { KakaoUserInfoDto } from './dto/kakao-user-info.dto';
import { NaverUserInfoDtd } from './dto/naver-user-info.dtd';
import { GoogleAccessDto } from './dto/google-access.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    // private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(UserPictureRepository)
    private userPictureRepository: UserPictureRepository,
    @InjectRepository(UserBackgroundRepository)
    private userBackgroundRepository: UserBackgroundRepository,
    private httpService: HttpService,
    private commonUtil: CommonUtil,
  ) {}

  /**
   * 카카오 유저 정보 가져오기
   * @param accessToken
   */
  async getKakaoInfos(accessToken: string): Promise<any> {
    const host = 'https://kapi.kakao.com/v2/user/me';
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    };
    const config = { headers };

    return await lastValueFrom(this.httpService.get(host, config));
  }

  /**
   * 카카오 회원가입
   * @param kakaoUserInfo
   */
  async signUpKakao(kakaoUserInfo: KakaoUserInfoDto): Promise<User> {
    if (!kakaoUserInfo.id) {
      throw new HttpException(
        { code: 'failure ', message: '잘못된 요청입니다.' },
        200,
      );
    }

    const providedId = kakaoUserInfo.id;
    const provider = 'kakao.com';

    const users: User[] = await this.userRepository.findBy({
      provider: provider,
      providedId: providedId,
    });

    if (users.length > 0) {
      throw new HttpException(
        { code: 'failure', message: '이미 회원가입된 사용자 입니다.' },
        200,
      );
    }

    const newUser: User = new User();
    newUser.provider = 'kakao.com';
    newUser.providedId = kakaoUserInfo.id;
    newUser.name = kakaoUserInfo.nickname;
    newUser.email = kakaoUserInfo.email;
    newUser.emailVerified = kakaoUserInfo.emailVerified;
    newUser.color = this.commonUtil.randomColor();

    await this.userRepository.save(newUser);

    const userPictureUrl: string = kakaoUserInfo.thumbnail_image;
    if (userPictureUrl) {
      userPictureUrl.replace('http://', 'https://');
    }

    const userPicture: UserPicture = new UserPicture();
    userPicture.userId = newUser.id;
    userPicture.url = userPictureUrl;

    await this.userPictureRepository.save(userPicture);

    newUser.picture = [userPicture];

    newUser.signUpType = 'kakao';

    return newUser;
  }

  /**
   * 카카오 로그인
   * @param accessToken
   */
  async signInKakao(accessToken: string): Promise<User> {
    const kakaoUserInfo: any = await this.getKakaoInfos(accessToken);

    if (!kakaoUserInfo) {
      throw new HttpException(
        { code: 'failure', message: '카카오 로그인 인증에 실패했습니다.' },
        200,
      );
    }

    const kakaoProfile: KakaoUserInfoDto = new KakaoUserInfoDto();
    kakaoProfile.init(kakaoUserInfo.data);

    let user: User | null = await this.userRepository.findOne({
      where: {
        provider: 'kakao.com',
        providedId: kakaoProfile.id,
      },
    });

    if (!user) {
      return await this.signUpKakao(kakaoProfile);
    } else {
      if (user.deletedAt) {
        throw new HttpException(
          { code: 'failure:deleted', message: user.id },
          500,
        );
      }

      const tokens: any = await this.createTokens(user.providedId, user.id);
      const images: any = await this.getUserPictureAndBackground(user.id);

      user = { ...user, ...tokens, ...images };

      return user!;
    }
  }

  /**
   * 카카오 연동해제
   * @param accessToken
   */
  async signOutKakao(accessToken: string): Promise<any> {
    const url = `https://kapi.kakao.com/v1/user/unlink`;
    const config = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    };
    return await lastValueFrom(this.httpService.post(url, {}, config));
  }

  /**
   * 네이버 유저 정보 가져오기
   * @param accessToken
   */
  async getNaverUserInfos(accessToken: string): Promise<any> {
    const host = 'https://openapi.naver.com';
    const url = `${host}/v1/nid/me`;
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    };

    return await lastValueFrom(this.httpService.get(url, config));
  }

  /**
   * 네이버 유저
   * @param code
   * Get JWT Access Token
   */
  async getNaverAccessToken(code: string): Promise<any> {
    const grantType = this.configService.get('NAVER_LOGIN_GRANT_TYPE');
    const clientId = this.configService.get('NAVER_LOGIN_CLIENT_ID');
    const clientSecret = this.configService.get('NAVER_LOGIN_CLIENT_SECRET');
    const state = '';
    const url = `${this.configService.get(
      'NAVER_LOGIN_API_URL',
    )}?grant_type=${grantType}&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&state=${state}`;
    const config = {};
    return await lastValueFrom(this.httpService.get(url, config));
  }

  /**
   * 네이버 로그인
   * @param code
   * Naver Open API return code
   */
  async signInNaver(code: string): Promise<User> {
    const naverAccessToken: any = await this.getNaverAccessToken(code);

    if (!naverAccessToken) {
      throw new HttpException(
        { code: 'failure', message: '잘못된 요청입니다.' },
        500,
      );
    }

    const naverUserInfos: any = await this.getNaverUserInfos(
      naverAccessToken.data?.access_token,
    );

    if (!naverUserInfos) {
      throw new HttpException(
        { code: 'failure', message: '유저 정보가 존재하지 않습니다.' },
        500,
      );
    }

    const naverUser: NaverUserInfoDtd = new NaverUserInfoDtd();
    naverUser.init(naverUserInfos.data.response);

    let user: User | null = await this.userRepository.findOne({
      where: {
        provider: 'naver.com',
        providedId: naverUser.id,
      },
    });

    if (!user) {
      let newUser: User = new User();
      newUser.provider = 'naver.com';
      newUser.providedId = naverUser.id;
      newUser.name = naverUser.name;
      newUser.email = naverUser.email;
      newUser.emailVerified = true;
      newUser.color = this.commonUtil.randomColor();

      await this.userRepository.save(newUser);

      if (naverUser.profile_image) {
        const userPicture: UserPicture = new UserPicture();
        userPicture.userId = newUser.id;
        userPicture.url = naverUser.profile_image;
        await this.userPictureRepository.save(userPicture);

        newUser.picture = [userPicture];
      }

      const tokens: any = await this.createTokens(
        newUser.providedId,
        newUser.id,
      );

      newUser = { ...newUser, ...tokens };

      newUser.signUpType = 'naver';

      return newUser;
    } else {
      if (user.deletedAt) {
        throw new HttpException(
          { code: 'failure:deleted', message: user.id },
          500,
        );
      }

      const userPictureAndBack: any = await this.getUserPictureAndBackground(
        user.id,
      );

      const tokens: any = await this.createTokens(user.providedId, user.id);

      user = { ...user, ...tokens, ...userPictureAndBack };

      return user!;
    }
  }

  /**
   * 이메일 로그인
   * @param userEmailSignInDto
   */
  async signIn(userEmailSignInDto: UserEmailSignInDto): Promise<User> {
    // 가입한 이메일 조회
    let user: User | null = await this.userRepository.findOne({
      where: {
        providedId: userEmailSignInDto.providedId,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          code: 'failure',
          message: '사용자가 존재하지 않습니다.',
        },
        500,
      );
    }

    if (user.deletedAt) {
      throw new HttpException(
        { code: 'failure:deleted', message: user.id },
        500,
      );
    }

    if (user.password && !(await bcrypt.compare(userEmailSignInDto.password, user.password))) {
      throw new HttpException(
        {
          code: 'failure',
          message: '비밀번호가 일치하지 않습니다.',
        },
        500,
      );
    }

    // 토큰 발행
    const tokens = await this.createTokens(
      userEmailSignInDto.providedId,
      user.id,
    );

    // 사진
    const userPictureAndBack: any = await this.getUserPictureAndBackground(
      user.id,
    );

    delete user.password;
    user = { ...user, ...tokens, ...userPictureAndBack };

    return user!;
  }

  /**
   * 유저 사진들 가져오기
   * @param userId
   */
  async getUserPictureAndBackground(userId: string): Promise<any> {
    const picture: UserPicture[] = await this.userPictureRepository
      .createQueryBuilder('userPicture')
      .where('userPicture.user_id = :userId', { userId })
      .orderBy('userPicture.created_at', 'DESC')
      .getMany();

    const background: UserBackground[] = await this.userBackgroundRepository
      .createQueryBuilder('background')
      .where('background.user_id = :userId', { userId })
      .orderBy('background.created_at', 'DESC')
      .getMany();

    return { picture, background };
  }

  /**
   * Access Token 발급
   * @param providedId
   */
  async createAccessToken(providedId: string): Promise<string> {
    // return this.jwtService.sign({ providedId });
    return '';
  }

  /**
   * Refresh Token 발급
   * @param providedId
   */
  async createRefreshToken(providedId: string): Promise<string> {
    // return this.jwtService.sign(
    //   { providedId },
    //   {
    //     secret: this.configService.get('JWT_REFRESH_SECRET'),
    //     expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    //   },
    // );
    return '';
  }

  /**
   * Access, Refresh, Firebase Token 발행
   * @param providedId
   * @param userId
   */
  async createTokens(providedId: string, userId: string): Promise<any> {
    // const accessToken: string = await this.createAccessToken(providedId);
    // const refreshToken: string = await this.createRefreshToken(providedId);
    // const customToken: string = await this.firebaseService.createCustomToken(
    //   userId,
    //   {},
    // );

    // return { accessToken, refreshToken, customToken };
  }

  async validateUser(id: string): Promise<User | undefined> {
    const user: User | null = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new HttpException(
        { code: 'failure', message: '유저 정보가 존재하지 않습니다.' },
        500,
      );
    }

    return user;
  }

  /**
   * 구글 로그인
   * @param googleAccessDto
   */
  async signInGoogle(googleAccessDto: GoogleAccessDto): Promise<User | null> {
    
    return null;
    // const googleUser: any = await this.firebaseService.verifyIdToken(
    //   googleAccessDto.accessToken,
    // );

    // if (!googleUser) {
    //   throw new HttpException(
    //     { code: 'failure', message: '잘못된 요청입니다.' },
    //     500,
    //   );
    // }

    // let user: User | null = await this.userRepository.findOne({
    //   where: {
    //     providedId: googleUser.user_id,
    //   },
    // });

    // if (!user) {
    //   // 회원가입
    //   return await this.signUpGoogle(googleUser);
    // } else {
    //   if (user.deletedAt) {
    //     throw new HttpException(
    //       { code: 'failure:deleted', message: user.id },
    //       500,
    //     );
    //   }

    //   const tokens: any = await this.createTokens(user.providedId, user.id);
    //   const images: any = await this.getUserPictureAndBackground(user.id);

    //   user = { ...user, ...tokens, ...images };

    //   return user!;
    // }
  }

  /**
   * 구글 회원가입
   * @param googleUser
   * @description googleUser is firebaseService.verifyIdToken(accessToken) for return value.
   */
  async signUpGoogle(googleUser: any): Promise<User> {
    if (!googleUser) {
      throw new HttpException(
        { code: 'failure', message: '잘못된 요청입니다.' },
        500,
      );
    }

    let user: User;

    const appendValue: any = {
      provider: 'google.com',
      providedId: googleUser.user_id,
      email: googleUser.email,
      emailVerified: googleUser.email_verified,
      name: googleUser.name,
      color: this.commonUtil.randomColor(),
    };

    user = { ...appendValue };

    await this.userRepository.save(user);

    if (googleUser?.picture) {
      const userPicture: UserPicture = new UserPicture();
      userPicture.userId = user.id;
      userPicture.url = googleUser.picture;

      await this.userPictureRepository.save(userPicture);

      user.picture = [userPicture];
    }

    const tokens = await this.createTokens(user.providedId, user.id);

    user = { ...user, ...tokens };

    user.signUpType = 'google';

    return user;
  }
}
