export class KakaoUserInfoDto {
  id: string;

  nickname: string;

  thumbnail_image: string;

  email: string;

  emailVerified: boolean;

  init(data: any) {
    this.id = data?.id;
    this.nickname = data.properties?.nickname;
    this.thumbnail_image = data.properties?.thumbnail_image;
    this.email = data.kakao_account.email;
    this.emailVerified = data.kakao_account?.is_email_verified;
  }
}
