import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
  const hash = (password: string) => bcrypt.hash(password, saltRounds);

  const users = [
    {
      name: 'Dueño',
      email: 'admin@motos.com',
      pass: 'admin123',
      role: 'ADMIN',
    },
    {
      name: 'Mecánico',
      email: 'mecanico@motos.com',
      pass: 'mecanico123',
      role: 'MECHANIC',
    },
    {
      name: 'Cliente',
      email: 'cliente@motos.com',
      pass: 'cliente123',
      role: 'CUSTOMER',
    },
  ] as const;

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: await hash(user.pass),
        role: user.role,
      },
    });
  }

  const catalog = {
    Honda: {
      country: 'Japón',
      models: [
        { model: 'CB 190R', year: 2026, engineCc: 184, price: 21000, stock: 4 },
        { model: 'XR 150L', year: 2025, engineCc: 149, price: 17500, stock: 6 },
      ],
    },
    Yamaha: {
      country: 'Japón',
      models: [
        { model: 'FZ 2.0', year: 2026, engineCc: 149, price: 19000, stock: 3 },
        { model: 'MT-03', year: 2026, engineCc: 321, price: 52000, stock: 1 },
      ],
    },
    Bajaj: {
      country: 'India',
      models: [
        {
          model: 'Pulsar NS 200',
          year: 2025,
          engineCc: 199,
          price: 18500,
          stock: 5,
        },
      ],
    },
  };

  for (const [name, { country, models }] of Object.entries(catalog)) {
    const brand = await prisma.brand.upsert({
      where: { name },
      update: {},
      create: { name, country },
    });
    const existing = await prisma.motorcycle.count({
      where: { brandId: brand.id },
    });
    if (existing === 0) {
      await prisma.motorcycle.createMany({
        data: models.map((moto) => ({ ...moto, brandId: brand.id })),
      });
    }
  }

  console.log('🌱 Seed completado');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
