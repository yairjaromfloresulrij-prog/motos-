import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { BrandsModule } from './brands/brands.module.js';
import { MotorcyclesModule } from './motorcycles/motorcycles.module.js';
import { SalesModule } from './sales/sales.module.js';
import { MaintenanceModule } from './maintenance/maintenance.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        libraryOptions: {
          abortEarly: false,
          allowUnknown: true,
        },
      },
    }),
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
