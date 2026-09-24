import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { JwtPayload } from '../auth/strategies/jwt.strategy.js';
import { Role } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto.js';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto.js';

@Injectable()
export class MaintenanceService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMaintenanceDto, user: JwtPayload) {
    return this.prisma.maintenanceOrder.create({
      data: {
        plate: dto.plate,
        description: dto.description,
        customerId: user.sub,
      },
    });
  }

  findAll(user: JwtPayload) {
    const where =
      user.role === Role.CUSTOMER
        ? { customerId: user.sub }
        : user.role === Role.MECHANIC
          ? { mechanicId: user.sub }
          : undefined;

    return this.prisma.maintenanceOrder.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true } },
        mechanic: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, user: JwtPayload) {
    const order = await this.prisma.maintenanceOrder.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true } },
        mechanic: { select: { id: true, name: true } },
      },
    });
    if (!order) throw new NotFoundException(`Orden ${id} no encontrada`);
    if (user.role === Role.CUSTOMER && order.customerId !== user.sub) {
      throw new ForbiddenException('No puedes ver órdenes de otros clientes');
    }
    return { ...order, currency: process.env.CURRENCY };
  }

  async update(id: number, dto: UpdateMaintenanceDto, user: JwtPayload) {
    const order = await this.prisma.maintenanceOrder.findUnique({
      where: { id },
    });
    if (!order) throw new NotFoundException(`Orden ${id} no encontrada`);
    if (user.role === Role.MECHANIC && order.mechanicId !== user.sub) {
      throw new ForbiddenException('Esta orden no está asignada a ti');
    }

    if (dto.mechanicId) {
      const mechanic = await this.prisma.user.findUnique({
        where: { id: dto.mechanicId },
      });
      if (!mechanic || mechanic.role !== Role.MECHANIC) {
        throw new BadRequestException(
          `El usuario ${dto.mechanicId} no existe o no es mecánico`,
        );
      }
    }

    return this.prisma.maintenanceOrder.update({
      where: { id },
      data: dto,
    });
  }
}
