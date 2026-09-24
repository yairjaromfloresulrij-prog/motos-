import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { BrandsModule } from './brands/brands.module.js';
import { MaintenanceModule } from './maintenance/maintenance.module.js';
import { MotorcyclesModule } from './motorcycles/motorcycles.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SalesModule } from './sales/sales.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    BrandsModule,
    MotorcyclesModule,
    SalesModule,
    MaintenanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
