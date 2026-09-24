import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { MaintenanceStatus } from '../../generated/prisma/enums.js';

export class UpdateMaintenanceDto {
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @IsOptional()
  @IsInt()
  mechanicId?: number;
}
