export class NaverUserInfoDtd {
  id: string;

  email: string;

  name: string;

  profile_image: string;

  init(data: any) {
    this.id = data.id;
    this.email = data?.email;
    this.name = data?.name;
    this.profile_image = data?.profile_image;
  }
}
