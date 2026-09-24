import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto.js';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto.js';

@Injectable()
export class MotorcyclesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMotorcycleDto) {
    return this.prisma.motorcycle.create({ data: dto });
  }

  findAll(brandId?: number) {
    return this.prisma.motorcycle.findMany({
      where: brandId ? { brandId } : undefined,
      include: { brand: true },
      orderBy: { model: 'asc' },
    });
  }

  async findOne(id: number) {
    const motorcycle = await this.prisma.motorcycle.findUnique({
      where: { id },
      include: { brand: true },
    });
    if (!motorcycle) throw new NotFoundException(`Moto ${id} no encontrada`);
    return motorcycle;
  }

  async update(id: number, dto: UpdateMotorcycleDto) {
    await this.findOne(id);
    return this.prisma.motorcycle.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.motorcycle.delete({ where: { id } });
  }
}
