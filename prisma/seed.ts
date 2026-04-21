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
      name: 'Amina Uwase',
      avatar: 'AU',
      color: 'from-pink-500 to-rose-500',
      rating: 5,
      date: 'Mata 2025',
      location: 'Kigali, Rwanda',
      text: 'I love shopping on Simba! The prices are unbeatable and delivery is always on time. Highly recommend to everyone in Kigali.',
      verified: true,
    },
    {
      name: 'Jean Pierre Habimana',
      avatar: 'JP',
      color: 'from-blue-500 to-cyan-500',
      rating: 5,
      date: 'Werurwe 2025',
      location: 'Musanze, Rwanda',
      text: 'Best online supermarket in Rwanda. The product variety is amazing — from food to cosmetics to baby products. Will definitely keep ordering!',
      verified: true,
    },
    {
      name: 'Claudine Mukamana',
      avatar: 'CM',
      color: 'from-purple-500 to-indigo-500',
      rating: 4,
      date: 'Werurwe 2025',
      location: 'Kigali, Rwanda',
      text: 'Simba niyo isoko nziza mu Rwanda. Ibicuruzwa bisa neza kandi abashoramari barabyita neza. Nzagaruka buri gihe!',
      verified: true,
    },
    {
      name: 'Eric Nshimiyimana',
      avatar: 'EN',
      color: 'from-green-500 to-teal-500',
      rating: 5,
      date: 'Gashyantare 2025',
      location: 'Huye, Rwanda',
      text: 'Fast delivery, great quality products, and excellent customer service. Simba has everything I need at prices I can afford.',
      verified: true,
    },
    {
      name: 'Marie Claire Ingabire',
      avatar: 'MI',
      color: 'from-amber-500 to-orange-500',
      rating: 5,
      date: 'Mutarama 2025',
      location: 'Kigali, Rwanda',
      text: 'Ndashimishwa cyane na Simba! Baby products zabo ziza kandi zifite ibiciro byiza. Ntabwo nzarekura gutura hano.',
      verified: true,
    },
  ];

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
