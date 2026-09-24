import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import type { JwtPayload } from '../auth/strategies/jwt.strategy.js';
import { Role } from '../generated/prisma/enums.js';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto.js';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto.js';
import { MaintenanceService } from './maintenance.service.js';

@Controller('maintenance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  create(@Body() dto: CreateMaintenanceDto, @CurrentUser() user: JwtPayload) {
    return this.maintenanceService.create(dto, user);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.maintenanceService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.maintenanceService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MECHANIC)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.maintenanceService.update(id, dto, user);
  }
}
