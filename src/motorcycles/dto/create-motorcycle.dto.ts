import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMotorcycleDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsInt()
  @Min(1990)
  @Max(2100)
  year: number;

  @IsInt()
  @IsPositive()
  engineCc: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  brandId: number;
}
