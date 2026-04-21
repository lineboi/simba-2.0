import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const productsPath = path.join(process.cwd(), 'public', 'simba_products.json');
  const rawData = fs.readFileSync(productsPath, 'utf-8');
  const data = JSON.parse(rawData);

  console.log('Start seeding...');

  for (const p of data.products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: p.price,
        category: p.category,
        subcategoryId: p.subcategoryId,
        inStock: p.inStock,
        image: p.image,
        unit: p.unit,
      },
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        subcategoryId: p.subcategoryId,
        inStock: p.inStock,
        image: p.image,
        unit: p.unit,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
