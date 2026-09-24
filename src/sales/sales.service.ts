import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { JwtPayload } from '../auth/strategies/jwt.strategy.js';
import { Role } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSaleDto) {
    const discountPercent = dto.discountPercent ?? 0;
    const maxDiscount = parseInt(process.env.MAX_DISCOUNT_PERCENT ?? '0', 10);
    if (discountPercent > maxDiscount) {
      throw new BadRequestException(
        `El descuento máximo permitido es ${maxDiscount}%`,
      );
    }

    const customer = await this.prisma.user.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Cliente ${dto.customerId} no encontrado`);
    }

    const motorcycle = await this.prisma.motorcycle.findUnique({
      where: { id: dto.motorcycleId },
    });
    if (!motorcycle) {
      throw new NotFoundException(`Moto ${dto.motorcycleId} no encontrada`);
    }
    if (motorcycle.stock <= 0) {
      throw new BadRequestException(
        `La moto ${motorcycle.model} no tiene stock`,
      );
    }

    const listPrice = Number(motorcycle.price);
    const finalPrice =
      Math.round(listPrice * (1 - discountPercent / 100) * 100) / 100;

    const [sale] = await this.prisma.$transaction([
      this.prisma.sale.create({
        data: {
          customerId: dto.customerId,
          motorcycleId: dto.motorcycleId,
          listPrice,
          discountPercent,
          finalPrice,
        },
        include: { motorcycle: { include: { brand: true } } },
      }),
      this.prisma.motorcycle.update({
        where: { id: dto.motorcycleId },
        data: { stock: { decrement: 1 } },
      }),
    ]);

    return { ...sale, currency: process.env.CURRENCY };
  }

  findAll(user: JwtPayload) {
    return this.prisma.sale.findMany({
      where: user.role === Role.CUSTOMER ? { customerId: user.sub } : undefined,
      include: {
        motorcycle: { include: { brand: true } },
        customer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
