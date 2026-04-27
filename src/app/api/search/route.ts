import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const q = query.toLowerCase();

    // 1. Fetch all products to perform matching
    // In a real app with Groq, we'd send the query and catalog to Groq
    const products = await prisma.product.findMany({
      include: { category: true }
    });

    // 2. Simulated "Conversational" matching logic
    const matchedProducts = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.name.toLowerCase().includes(q) ||
      (q.includes('milk') && p.name.toLowerCase().includes('milk')) ||
      (q.includes('breakfast') && (p.category.name.toLowerCase().includes('food') || p.name.toLowerCase().includes('bread') || p.name.toLowerCase().includes('egg')))
    ).slice(0, 5);

    // 3. Simulated Natural Language Response
    let responseText = "";
    if (matchedProducts.length > 0) {
      responseText = `I found ${matchedProducts.length} items that match "${query}". Our ${matchedProducts[0].name} is a popular choice!`;
      if (q.includes('breakfast')) {
        responseText = "For a great breakfast, I recommend these fresh items from our catalog. We have fresh milk and bread available for pick-up.";
      }
    } else {
      responseText = `I couldn't find exactly what you're looking for with "${query}", but here are some popular categories you might like!`;
    }

    return NextResponse.json({
      response: responseText,
      products: matchedProducts.map(p => ({
        ...p,
        category: p.category.name
      })),
      model: "llama-3.3-70b-versatile (Simulated)"
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}
