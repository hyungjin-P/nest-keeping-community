import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegistrationDto } from './dto/user.registration.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UserPictureRepository } from './user-picture/user-picture.repository';
import { UserBackgroundRepository } from './user-background/user-background.repository';
import { UserPicture } from './user-picture/user-picture.entity';
import { UserBackground } from './user-background/user-background.entity';
import { UserProfileDto } from './dto/user.profile.dto';
import * as bcrypt from 'bcryptjs';
import { UserPasswordChangeDto } from './dto/user.password-change.dto';
import { UserModifyServiceTermDto } from '../auth/dto/user-modify-service-term.dto';
import { UserFilteringDto } from '../admin/dto/user-filtering.dto';
import { Between, ILike } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(UserPictureRepository)
    private userPictureRepository: UserPictureRepository,
    @InjectRepository(UserBackgroundRepository)
    private userBackgroundRepository: UserBackgroundRepository,
  ) {}

  /**
   * 모든 유저 조회
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * 유저 1건 조회
   * @param id (key)
   */
  async findById(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        { code: 'failure', message: '사용자가 없습니다.' },
        500,
      );
    }

    if (user.deletedAt) {
      throw new HttpException(
        { code: 'failure:deleted', message: user.id },
        500,
      );
    }

    delete user.password;

    // 프로필 사진, 배경 사진
    const userPictureAndBackground: any =
      await this.getUserPictureAndBackground(user.id);
    user.picture = userPictureAndBackground.picture;
    user.background = userPictureAndBackground.background;

    return user;
  }

  /**
   * 유저 정보 수정
   * @param user
   */
  async modify(user: User): Promise<User> {
    if (!user.id) {
      throw new HttpException(
        { code: 'failure', message: '사용자가 존재하지 않습니다' },
        500,
      );
    }
    return await this.userRepository.save(user);
  }

  /**
   * 유저 생성
   * @param user
   */
  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  /**
   * 유저 레코드 1건 삭제
   * @param id (key)
   */
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * 유저 삭제(soft delete)
   * @param id
   */
  async softDelete(id: string) {
    return await this.userRepository.save({ id: id, deletedAt: new Date() });
  }

  /**
   * 이메일 중복 확인
   * @param providedId
   * */
  async hasProvidedIdAndDeleteAtIsNull(providedId: string): Promise<boolean> {
    return await this.userRepository.hasProvidedIdAndDeleteAtIsNull(providedId);
  }

  /**
   * 이메일로 회원 목록 조회
   * @param providedId
   * @param emailVerificationCode
   */
  async findAllByProvidedId(
    providedId: string,
    emailVerificationCode: number,
  ): Promise<User[]> {
    return await this.userRepository.findAllByProvidedIdAndDeleteAtIsNUll(
      providedId,
      emailVerificationCode,
    );
  }

  /**
   * 이메일 회원가입
   * @param userRegistrationDto
   * */
  async registration(userRegistrationDto: UserRegistrationDto): Promise<User> {
    const isSigned = await this.userRepository.hasProvidedIdAndDeleteAtIsNull(
      userRegistrationDto.email,
    );

    if (isSigned) {
      throw new HttpException(
        { code: 'failure', message: '이미 등록된 메일 입니다.' },
        500,
      );
    }

    const user: User = await this.userRepository.registrationUser(
      userRegistrationDto,
    );

    const userPictureAndBackground: any =
      await this.getUserPictureAndBackground(user.id);
    user.picture = userPictureAndBackground.picture;
    user.background = userPictureAndBackground.background;

    return user;
  }

  /**
   * 유저 페이지 조회
   * @param options: IPaginationOptions => require to limit and page
   * Ex) let options = { limit: 5, page: 1 }
   */
  async getUserPage(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = await this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.created_at', 'DESC');

    return paginate<User>(queryBuilder, options);
  }

  /**
   * 닉네임 중복확인
   * @param nickName
   * @param userId
   */
  async duplicateUserNickName(
    nickName: string,
    userId: string,
  ): Promise<boolean> {
    return this.userRepository.countUserNicknameAndUserId(nickName, userId);
  }

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

    return {
      picture,
      background,
    };
  }

  async getUserPictures(userId: string): Promise<UserPicture[]> {
    return await this.userPictureRepository
      .createQueryBuilder('userPicture')
      .where('userPicture.user_id = :userId', { userId })
      .orderBy('userPicture.created_at', 'DESC')
      .limit(1)
      .getMany();
  }

  /**
   * 유저 프로필 수정
   * @param userProfileDto
   */
  async modifyUserProfile(userProfileDto: UserProfileDto): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({
      id: userProfileDto.userId,
    });

    if (!user) {
      throw new HttpException(
        { code: 'failure', message: '해당 사용자가 존재하지 않습니다.' },
        500,
      );
    }

    user.nickname = userProfileDto.nickName;
    user.aboutMe = userProfileDto.aboutMe;

    await this.userRepository.save(user);

    const pictureAndBackground: any = await this.getUserPictureAndBackground(
      user.id,
    );

    user.picture = pictureAndBackground.picture;
    user.background = pictureAndBackground.background;

    return user;
  }

  /**
   * 유저 비밀번호 변경
   * @param userPasswordChangeDto
   * @return password
   * */
  async changeUserPassword(
    userPasswordChangeDto: UserPasswordChangeDto,
  ): Promise<void> {
    const user: User | null = await this.userRepository.findOneBy({
      id: userPasswordChangeDto.userId,
    });

    if (!user) {
      throw new HttpException(
        { code: 'failure', message: '해당 사용자가 존재하지 않습니다.' },
        500,
      );
    }

    if (
      user.password &&
      !(await bcrypt.compare(userPasswordChangeDto.oldPassword, user.password))
    ) {
      throw new HttpException(
        {
          code: 'failure',
          message: '기존 비밀번호가 일치하지 않습니다.',
        },
        500,
      );
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(userPasswordChangeDto.newPassword, salt);

    await this.userRepository.save(user);
  }

  /**
   * 유저 비밀번호 변경
   * @return password
   * @param userId
   * @param newPassword
   * */
  async changeUserPasswordEmailVerified(
    userId: string,
    newPassword: string,
  ): Promise<void> {
    const user: User | null = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new HttpException(
        { code: 'failure', message: '해당 사용자가 존재하지 않습니다.' },
        500,
      );
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);

    await this.userRepository.save(user);
  }

  /**
   * 유저 서비스 이용약관 수정
   * @param modifyInfo
   */
  async modifyUserServiceTerm(
    modifyInfo: UserModifyServiceTermDto,
  ): Promise<void> {
    const user: User | null = await this.userRepository.findOneBy({
      id: modifyInfo.userId ,
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

    const serviceTerm = modifyInfo;

    await this.userRepository.save({ ...user, ...serviceTerm });
  }

  /**
   * 유저 ids로 조회
   * @param userIds
   */
  async findUserIds(userIds: string[]): Promise<User[]> {
    const users: User[] = await this.userRepository.findUserInIds(userIds);

    if (users.length > 0) {
      for (const user of users) {
        user.picture = await this.getUserPictures(user.id);
        delete user.password;
      }
    }

    return users;
  }

  /**
   * 이메일 회원가입 유저 providedId로 조회
   * @param email
   */
  async findOneByProvidedIdOfUser(email: string): Promise<User> {
    const findOptions = {
      where: {
        providedId: email,
        emailVerified: true,
        provider: 'keeping.link',
      },
    };

    const user: User | null = await this.userRepository.findOne(findOptions);

    if (!user) {
      throw new HttpException(
        { code: 'failure', message: '회원가입된 회원이 없습니다.' },
        500,
      );
    }

    return user;
  }

  /**
   * 회원 정보 필터링해서 조회
   * @param userFilteringDto
   * @param pageOptions
   */
  async findUserFilteringPages(
    userFilteringDto: UserFilteringDto,
    pageOptions: IPaginationOptions,
  ): Promise<Pagination<User>> {
    const searchOptions: any = {
      relations: ['userPicture', 'userBackground'],
      where: {
        emailVerified: true,
      },
    };

    if (userFilteringDto.isIncludeAgreement) {
      searchOptions.where = {
        ...searchOptions.where,
        agreementAge: userFilteringDto.agreementAge,
        agreementPrivacy: userFilteringDto.agreementPrivacy,
        agreementServiceTerms: userFilteringDto.agreementServiceTerms,
        agreementMarketing: userFilteringDto.agreementMarketing,
      };
    }

    if (userFilteringDto.email) {
      searchOptions.where = {
        ...searchOptions.where,
        email: ILike(`%${userFilteringDto.email}%`),
      };
    }

    if (userFilteringDto.nickname) {
      searchOptions.where = {
        ...searchOptions.where,
        nickname: ILike(`%${userFilteringDto.nickname}%`),
      };
    }

    if (userFilteringDto.name) {
      searchOptions.where = {
        ...searchOptions.where,
        name: ILike(`%${userFilteringDto.name}%`),
      };
    }

    if (userFilteringDto.sortedColumn && userFilteringDto.sortedDirection) {
      searchOptions.order = {};
      searchOptions.order[userFilteringDto.sortedColumn] =
        userFilteringDto.sortedDirection;
    } else {
      searchOptions.order = {};
      searchOptions.order.createdAt = 'DESC';
    }

    if (userFilteringDto.isIncludeDate) {
      searchOptions.where = {
        ...searchOptions.where,
        createdAt: Between(userFilteringDto.from, userFilteringDto.to),
      };
    }

    return await paginate<User>(
      this.userRepository,
      pageOptions,
      searchOptions,
    );
  }

  async softDeleteCancel(userId: string) {
    return await this.userRepository.softDelete(userId);
  }
}
