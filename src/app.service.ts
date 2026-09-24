import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getStoreInfo() {
    return {
      shopName: this.configService.get<string>('SHOP_NAME'),
      currency: this.configService.get<string>('CURRENCY'),
      environment: this.configService.get<string>('NODE_ENV'),
      status: 'online',
    };
  }
}
