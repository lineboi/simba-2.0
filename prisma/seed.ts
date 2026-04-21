import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
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

  // 1. Seed Categories
  const categoryMap: Record<string, number> = {};
  const categories = [...new Set(data.products.map((p: any) => p.category))] as string[];

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
  for (const p of data.products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: p.price,
        categoryId: categoryMap[p.category],
        subcategoryId: p.subcategoryId,
        inStock: p.inStock,
        image: p.image,
        unit: p.unit,
      },
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
        categoryId: categoryMap[p.category],
        subcategoryId: p.subcategoryId,
        inStock: p.inStock,
        image: p.image,
        unit: p.unit,
      },
    });
  }

  // 3. Seed Reviews
  const INITIAL_REVIEWS = [
    {
      name: 'Gwiza Moise',
      avatar: 'GM',
      color: 'from-orange-500 to-amber-500',
      rating: 5,
      date: 'Mata 2025',
      location: 'Kigali, Rwanda',
      text: 'Simba Supermarket ni aho nagurana ibintu byose. Ibicuruzwa byabo biza kandi bireshya cyane. Natumije amakoperative menshi kandi byose byageze vuba kandi nta kibazo. Ndashimira cyane aba bakoze iyi website nziza!',
      verified: true,
    },
    {
        name: 'Richard Madete',
        avatar: 'RM',
        color: 'from-blue-500 to-indigo-500',
        rating: 5,
        date: 'April 2026',
        location: 'UTC, Kigali',
        text: 'Simba Supermarket is simple the largest and the best supermarket in Kigali city center and in the country in general.',
        verified: true,
    },
    {
        name: 'Stella Matutina',
        avatar: 'SM',
        color: 'from-yellow-500 to-orange-500',
        rating: 5,
        date: 'April 2026',
        location: 'KN 5 Rd, Kigali',
        text: 'It’s the first supermarket in Kigali where you can find everything you want + cooked food and it’s affordable you can also find it everywhere in Kigali it has more than 7 branches in Kigali',
        verified: true,
    },
    {
        name: 'Dipankar Lahkar',
        avatar: 'DL',
        color: 'from-green-500 to-teal-500',
        rating: 5,
        date: 'April 2026',
        location: 'KG 541 St, Kigali',
        text: 'Simba stores are the greatest location in Kigali to buy groceries and other home items.',
        verified: true,
    },
    {
        name: 'MUHOZA Rene',
        avatar: 'MR',
        color: 'from-purple-500 to-pink-500',
        rating: 4,
        date: 'April 2026',
        location: '24Q5+R2R, Kigali',
        text: 'Despite its dim lighting, Simba is packed with nearly everything you’d need food‑wise in Rwanda it’s full of products.',
        verified: true,
    },
    {
        name: 'Niyotwiringiye Charles',
        avatar: 'NC',
        color: 'from-orange-500 to-red-500',
        rating: 5,
        date: 'April 2026',
        location: 'Kimironko, Kigali',
        text: 'Simba Supermarket, Kimironko is a Supermarket located at 342F+3V5, Kimironko, Kigali, RW.',
        verified: true,
    },
    {
        name: 'Cyuzuzo Ngenzi',
        avatar: 'CN',
        color: 'from-red-500 to-rose-500',
        rating: 1,
        date: 'April 2026',
        location: 'Multiple Locations',
        text: 'Very bad experiences across multiple Simba locations (Musanze, Kigali city center near Beka, and Nyamirambo near Cosmos).',
        verified: false,
    },
    {
        name: 'SIBOMANA Eugene',
        avatar: 'SE',
        color: 'from-cyan-500 to-blue-500',
        rating: 5,
        date: 'April 2026',
        location: '24G3+MCV, Kigali',
        text: 'Simba is my go-to supermarket in Kigali.',
        verified: true,
    },
    {
        name: 'Matylda B',
        avatar: 'MB',
        color: 'from-emerald-500 to-green-500',
        rating: 4,
        date: 'April 2026',
        location: 'Kigali, Rwanda',
        text: 'I assure you I don’t come all the way from Europe to Rwanda in order to steal groceries!',
        verified: true,
    },
    {
        name: 'Bethany Mattison',
        avatar: 'BM',
        color: 'from-rose-500 to-pink-500',
        rating: 3,
        date: 'April 2026',
        location: 'KK 35 Ave, Kigali',
        text: 'It\'s not the best Simba supermarket But I\'ve only been to three counting this one it is the least of the three I\'ve been to.',
        verified: false,
    },
    {
        name: 'mutuyimana',
        avatar: 'M',
        color: 'from-amber-500 to-yellow-500',
        rating: 4,
        date: 'April 2026',
        location: 'Kigali, Rwanda',
        text: 'Supermarket',
        verified: false,
    }
  ];

  // Clear old reviews to avoid duplicates on re-seed
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
