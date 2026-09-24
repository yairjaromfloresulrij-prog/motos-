import { Module } from '@nestjs/common';
import { MotorcyclesController } from './motorcycles.controller.js';
import { MotorcyclesService } from './motorcycles.service.js';

@Module({
  controllers: [MotorcyclesController],
  providers: [MotorcyclesService],
})
export class MotorcyclesModule {}
