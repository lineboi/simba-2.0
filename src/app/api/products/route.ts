import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    
    // Structure it to match what the frontend expects (ProductsData)
    // The frontend expects { store: ..., products: [...] }
    // We can either fetch store info from DB or just hardcode/fetch from another place.
    // For now, I'll return the same structure.
    
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
