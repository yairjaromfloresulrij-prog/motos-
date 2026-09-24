import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSaleDto } from './dto/create-sale.dto.js';

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const maxDiscount = Number(
      this.configService.get<number>('MAX_DISCOUNT_PERCENT', 0),
    );
    const discountPercent = createSaleDto.discountPercent || 0;

    if (discountPercent > maxDiscount) {
      throw new BadRequestException(
        `El descuento no puede superar el ${maxDiscount}%`,
      );
    }

    const motorcycle = await this.prisma.motorcycle.findUnique({
      where: { id: createSaleDto.motorcycleId },
    });

    if (!motorcycle) {
      throw new NotFoundException('Moto no encontrada');
    }

    if (motorcycle.stock <= 0) {
      throw new BadRequestException('No hay stock disponible de esta moto');
    }

    const listPrice = Number(motorcycle.price);
    const discountAmount = (listPrice * discountPercent) / 100;
    const finalPrice = listPrice - discountAmount;

    return this.prisma.$transaction(async (tx) => {
      await tx.motorcycle.update({
        where: { id: motorcycle.id },
        data: { stock: motorcycle.stock - 1 },
      });

      return tx.sale.create({
        data: {
          customerId: createSaleDto.customerId,
          motorcycleId: createSaleDto.motorcycleId,
          discountPercent,
          listPrice,
          finalPrice,
        },
        include: {
          customer: { select: { id: true, name: true, email: true } },
          motorcycle: true,
        },
      });
    });
  }

  async findAll(user?: { id: number; role: string }) {
    if (user?.role === 'CUSTOMER') {
      return this.findByCustomer(user.id);
    }

    return this.prisma.sale.findMany({
      include: {
        customer: { select: { id: true, name: true, email: true } },
        motorcycle: true,
      },
    });
  }

  async findByCustomer(customerId: number) {
    return this.prisma.sale.findMany({
      where: { customerId },
      include: {
        motorcycle: true,
      },
    });
  }
}
