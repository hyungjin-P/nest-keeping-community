export class File {
  constructor(
    public url: string,
    public originalname: string,
    public mimetype: string,
    public size: number,
  ) {
    this.url = url;
    this.originalname = originalname;
    this.mimetype = mimetype;
    this.size = size;
  }
}
