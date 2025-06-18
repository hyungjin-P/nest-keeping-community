import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { HttpException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(id: string): Promise<any> {
    const user = await this.authService.validateUser(id);

    if (!user) {
      throw new HttpException(
        { code: 'failure', message: '사용자가 없습니다.' },
        401,
      );
    }

    return user;
  }
}
