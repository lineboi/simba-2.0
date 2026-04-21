import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const productsFromDb = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    // Map the relational data back to the format the frontend expects
    const products = productsFromDb.map(p => ({
      ...p,
      category: p.category.name
    }));
    
    return NextResponse.json({
      store: {
        name: "Simba Supermarket",
        tagline: "Rwanda's Online Supermarket",
        location: "Kigali, Rwanda",
        currency: "RWF"
      },
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
