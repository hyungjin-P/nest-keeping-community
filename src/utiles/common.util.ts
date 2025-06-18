import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonUtil {
  public randomColor() {
    const colorList = [
      '#FFE885',
      '#BBE17B',
      '#BBEAFF',
      '#A2BDFC',
      '#FFA5C1',
      '#F8B990',
      '#6AD2C0',
      '#6B9CB2',
      '#9289D2',
      '#EB7C7C',
    ];

    const randomInt = this.getRandomInt(0, 10);

    return colorList[randomInt];
  }

  public getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  public getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min; // 최댓값은 제외, 최솟값은 포함
  }

  public getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min; // 최댓값도 포함, 최솟값도 포함
  }
}
