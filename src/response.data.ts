export class ResponseData {
  status: string;

  code: string;

  data: any;

  constructor(status: string, code: string, data: any) {
    this.status = status;
    this.code = code;
    this.data = data;
  }
}
