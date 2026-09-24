import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class CreateSaleDto {
  @IsInt()
  customerId: number;

  @IsInt()
  motorcycleId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  discountPercent?: number;
}
