import { PartialType } from '@nestjs/mapped-types';
import { CreateMotorcycleDto } from './create-motorcycle.dto.js';

export class UpdateMotorcycleDto extends PartialType(CreateMotorcycleDto) {}
