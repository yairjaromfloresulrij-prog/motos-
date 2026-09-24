import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateMaintenanceDto {
  @IsString()
  @Matches(/^[0-9]{3,4}[A-Z]{3}$/, {
    message: 'plate debe tener el formato 1234ABC',
  })
  plate: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
