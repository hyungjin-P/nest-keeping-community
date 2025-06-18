import { EntityRepository, getRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { UserRegistrationDto } from './dto/user.registration.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * 회원가입한 유저인지 검사
   * @param providedId
   */
  async hasProvidedIdAndDeleteAtIsNull(providedId: string): Promise<boolean> {
    const users: User[] = await getRepository(User)
      .createQueryBuilder('user')
      .where(
        'user.provided_id = :providedId and deleted_at is null and email_verified = 1',
        {
          providedId,
        },
      )
      .getMany();
    return users.length > 0;
  }

  /**
   * describe : 이메일과 인증번호로 조회
   * @param providedId
   * @param emailVerificationCode
   */
  async findAllByProvidedIdAndDeleteAtIsNUll(
    providedId: string,
    emailVerificationCode: number,
  ): Promise<User[]> {
    return await getRepository(User)
      .createQueryBuilder('user')
      .where(
        'user.provided_id = :providedId ' +
          'and user.email_verification_code = :emailVerificationCode ' +
          'and deleted_at is null',
        {
          providedId,
          emailVerificationCode,
        },
      )
      .getMany();
  }

  /**
   * describe : 회원가입 완료
   * @param userRegistrationDto
   */
  async registrationUser(
    userRegistrationDto: UserRegistrationDto,
  ): Promise<User> {
    // 인코딩 salt
    const salt = await bcrypt.genSalt();

    // 이메일, 코드로 유저 조회
    const user = await this.findAllByProvidedIdAndDeleteAtIsNUll(
      userRegistrationDto.email,
      userRegistrationDto.verificationCode,
    );

    user[0].password = await bcrypt.hash(userRegistrationDto.password, salt);
    user[0].agreementAge = true;
    user[0].agreementPrivacy = true;
    user[0].agreementServiceTerms = true;
    user[0].agreementMarketing = true;
    user[0].emailVerified = true;

    return await this.save(user[0]);
  }

  async countUserNicknameAndUserId(
    nickName: string,
    userId: string,
  ): Promise<boolean> {
    const users: User[] = await getRepository(User)
      .createQueryBuilder('user')
      .where(`user.nickname = :nickName`, { nickName })
      .getMany();

    if (users.length > 0) {
      const count: number = users.filter((user) => user.id !== userId).length;
      if (count > 0) {
        return false;
      }
    }
    return true;
  }

  async findUserInIds(userIds: string[]): Promise<User[]> {
    return await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id in (:userIds)', {
        userIds,
      })
      .getMany();
  }
}
