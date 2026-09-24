import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      shop: process.env.SHOP_NAME,
      currency: process.env.CURRENCY,
      environment: process.env.NODE_ENV,
      status: 'ok',
    };
  }
}
