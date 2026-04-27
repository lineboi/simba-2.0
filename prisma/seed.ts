import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

interface RawProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategoryId: number;
  image: string;
  unit: string;
}

async function main() {
  const productsPath = path.join(process.cwd(), 'public', 'simba_products.json');
  const rawData = fs.readFileSync(productsPath, 'utf-8');
  const data = JSON.parse(rawData) as { products: RawProduct[] };

  console.log('Start seeding...');

  // 1. Seed Categories
  const categoryMap: Record<string, number> = {};
  const categories = [...new Set(data.products.map((p) => p.category))];

  const CATEGORY_EMOJIS: Record<string, string> = {
    'Food Products': '🥬',
    'Cosmetics & Personal Care': '🧴',
    'Cleaning & Sanitary': '🧹',
    'Alcoholic Drinks': '🍺',
    'Baby Products': '👶',
    'Kitchenware & Electronics': '🍳',
    'Kitchen Storage': '🫙',
    'Sports & Fitness': '💪',
    'Sports & Wellness': '🏃',
    'Stationery': '📚',
    'Pet Care': '🐾',
    'General': '🛒',
  };

  for (const catName of categories) {
    const category = await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: {
        name: catName,
        emoji: CATEGORY_EMOJIS[catName] || '🛒',
      },
    });
    categoryMap[catName] = category.id;
  }

  // 2. Seed Products
  const productIds: number[] = [];
  for (const p of data.products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: p.price,
        categoryId: categoryMap[p.category],
        subcategoryId: p.subcategoryId,
        image: p.image,
        unit: p.unit,
      },
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
        categoryId: categoryMap[p.category],
        subcategoryId: p.subcategoryId,
        image: p.image,
        unit: p.unit,
      },
    });
    productIds.push(p.id);
  }

  // 3. Seed Branches
  const BRANCHES = [
    { name: 'Simba Supermarket Remera', location: 'Remera, Kigali' },
    { name: 'Simba Supermarket Kimironko', location: 'Kimironko, Kigali' },
    { name: 'Simba Supermarket Kacyiru', location: 'Kacyiru, Kigali' },
    { name: 'Simba Supermarket Nyamirambo', location: 'Nyamirambo, Kigali' },
    { name: 'Simba Supermarket Gikondo', location: 'Gikondo, Kigali' },
    { name: 'Simba Supermarket Kanombe', location: 'Kanombe, Kigali' },
    { name: 'Simba Supermarket Kinyinya', location: 'Kinyinya, Kigali' },
    { name: 'Simba Supermarket Kibagabaga', location: 'Kibagabaga, Kigali' },
    { name: 'Simba Supermarket Nyanza', location: 'Nyanza, Kigali' },
  ];

  const branchIds: string[] = [];
  for (const b of BRANCHES) {
    const branch = await prisma.branch.upsert({
      where: { name: b.name },
      update: {},
      create: b,
    });
    branchIds.push(branch.id);
  }

  // 4. Seed Inventory (Random stock for each branch)
  for (const branchId of branchIds) {
    for (const productId of productIds) {
      await prisma.branchStock.upsert({
        where: {
          branchId_productId: {
            branchId,
            productId,
          },
        },
        update: {},
        create: {
          branchId,
          productId,
          quantity: Math.floor(Math.random() * 50) + 10, // 10-60 items
        },
      });
    }
  }

  // 5. Seed Users
  const users = [
    { email: 'admin@simba.rw', name: 'Admin User', role: 'ADMIN', password: 'password123' },
    { email: 'remera@simba.rw', name: 'Remera Manager', role: 'BRANCH_MANAGER', branchId: branchIds[0], password: 'password123' },
    { email: 'staff@simba.rw', name: 'Remera Staff', role: 'BRANCH_STAFF', branchId: branchIds[0], password: 'password123' },
    { email: 'test@test.com', name: 'Customer User', role: 'CUSTOMER', password: 'password123' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u,
    });
  }

  // 6. Seed Reviews (linked to branches)
  const INITIAL_REVIEWS = [
    {
      name: 'Gwiza Moise',
      avatar: 'GM',
      color: 'from-orange-500 to-amber-500',
      rating: 5,
      date: 'Mata 2025',
      location: 'Kigali, Rwanda',
      text: 'Simba Supermarket ni aho nagurana ibintu byose. Ibicuruzwa byabo biza kandi bireshya cyane.',
      verified: true,
      branchId: branchIds[0]
    },
    {
        name: 'Richard Madete',
        avatar: 'RM',
        color: 'from-blue-500 to-indigo-500',
        rating: 5,
        date: 'April 2026',
        location: 'UTC, Kigali',
        text: 'Simba Supermarket is simple the largest and the best supermarket in Kigali city center.',
        verified: true,
        branchId: branchIds[1]
    }
  ];

  await prisma.review.deleteMany({});
  for (const r of INITIAL_REVIEWS) {
    await prisma.review.create({
      data: r
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
