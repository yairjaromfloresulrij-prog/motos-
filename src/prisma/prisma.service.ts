import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(configService: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: configService.get<string>('DATABASE_URL'),
    });

    const isDev = configService.get<string>('NODE_ENV') === 'development';

    super({
      adapter,
      log: isDev ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
