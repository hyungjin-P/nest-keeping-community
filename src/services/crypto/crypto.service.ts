import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  encrypt(encryptTarget: any): string {
    const itemStr: string = this._utf8_encode(JSON.stringify(encryptTarget));
    const plainText = this.configService.get('UTILS_CRYPTO_PLAINTEXT');
    return CryptoJS.AES.encrypt(itemStr, plainText).toString();
  }

  decrypt(encryptStr: string): any {
    const plainText = this.configService.get('UTILS_CRYPTO_PLAINTEXT');
    return JSON.parse(
      this._utf8_decode(
        CryptoJS.AES.decrypt(encryptStr, plainText).toString(CryptoJS.enc.Utf8),
      ),
    );
  }

  encodeBase64(encodeTarget: string): string {
    const textArray = CryptoJS.enc.Utf8.parse(encodeTarget);
    return CryptoJS.enc.Base64url.stringify(textArray);
  }

  decodeBase64(encodingText: string): string {
    const parseTextArray = CryptoJS.enc.Base64url.parse(encodingText);
    return parseTextArray.toString(CryptoJS.enc.Utf8);
  }

  _utf8_encode(str: string): string {
    str = str.replace(/\r\n/g, '\n');
    let resultText = '';

    for (let n = 0; n < str.length; n++) {
      const c = str.charCodeAt(n);

      if (c < 128) {
        resultText += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        resultText += String.fromCharCode((c >> 6) | 192);
        resultText += String.fromCharCode((c & 63) | 128);
      } else {
        resultText += String.fromCharCode((c >> 12) | 224);
        resultText += String.fromCharCode(((c >> 6) & 63) | 128);
        resultText += String.fromCharCode((c & 63) | 128);
      }
    }
    return resultText;
  }

  _utf8_decode(str: string): string {
    let result = '';
    let i = 0;
    let c1 = 0;
    let c2 = 0;
    let c3 = 0;

    while (i < str.length) {
      c1 = str.charCodeAt(i);

      if (c1 < 128) {
        result += String.fromCharCode(c1);
        i++;
      } else if (c1 > 191 && c1 < 224) {
        c2 = str.charCodeAt(i + 1);
        result += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = str.charCodeAt(i + 1);
        c3 = str.charCodeAt(i + 2);
        result += String.fromCharCode(
          ((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63),
        );
        i += 3;
      }
    }

    return result;
  }
}
