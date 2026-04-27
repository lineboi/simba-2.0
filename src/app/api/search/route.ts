import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'gsk_simba_placeholder_key',
});

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. Fetch catalog for context
    const products = await prisma.product.findMany({
      include: { category: true }
    });

    const catalogStr = products.map(p => 
      `${p.name} (${p.category.name}) - ${p.price} RWF`
    ).join(', ');

    let responseText = "";
    let matchedProducts: any[] = [];

    // 2. Try real Groq if key is present and not the placeholder
    if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.startsWith('gsk_simba')) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are Simba AI, a helpful, multilingual assistant for Simba Supermarket in Kigali, Rwanda. 
              You MUST be able to understand and respond fluently in English, French, and Kinyarwanda.
              
              CONTEXT:
              You have access to this product catalog: ${catalogStr}. 
              
              GUIDELINES:
              1. Respond in the SAME language the user uses (English, French, or Kinyarwanda).
              2. Be polite, helpful, and culturally relevant to the Rwandan context.
              3. If the user asks for products, identify the IDs of the products that match their intent from the catalog.
              4. Even if you respond in Kinyarwanda or French, ensure the "productIds" array contains the correct numeric IDs from the catalog.
              
              OUTPUT FORMAT:
              You MUST return a JSON object: { "text": "your natural response in the user's language", "productIds": [1, 2, 3] }`
            },
            {
              role: 'user',
              content: query
            }
          ],
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' }
        });

        const result = JSON.parse(chatCompletion.choices[0].message.content || '{}');
        responseText = result.text;
        const productIds = result.productIds || [];
        matchedProducts = products.filter(p => productIds.includes(p.id));
      } catch (err) {
        console.error('Groq API Error, falling back to local search:', err);
      }
    }

    // 3. Fallback / Improved Local Search if Groq fails or is not configured
    if (!responseText) {
      const q = query.toLowerCase();
      
      // Kinyarwanda -> English mapping for local search intelligence
      const rwMapping: Record<string, string> = {
        'amata': 'milk',
        'umugati': 'bread',
        'isukari': 'sugar',
        'amavuta': 'oil butter',
        'inyama': 'meat',
        'inkoko': 'chicken',
        'ibishyimbo': 'beans',
        'umuceri': 'rice',
        'ibirayi': 'potatoes',
        'imbuto': 'fruit',
        'amagi': 'egg',
        'amazi': 'water',
        'isabune': 'soap',
        'umunyu': 'salt',
        'ifi': 'fish',
      };

      // Expand search query with mapped English terms
      let expandedQuery = q;
      Object.entries(rwMapping).forEach(([rw, en]) => {
        if (q.includes(rw)) expandedQuery += ' ' + en;
      });

      const searchTerms = expandedQuery.split(' ');

      matchedProducts = products.filter(p => {
        const pName = p.name.toLowerCase();
        const pCat = p.category.name.toLowerCase();
        return searchTerms.some(term => 
          term.length > 2 && (pName.includes(term) || pCat.includes(term))
        );
      }).slice(0, 6);

      if (matchedProducts.length > 0) {
        // Simple multilingual response based on first word of original query
        if (q.includes('mufite') || q.includes('nshaka') || q.includes('kiguzi')) {
          responseText = `Nabonye ibi bikurikira: ${matchedProducts[0].name}. Hari ikindi nkwafasha?`;
        } else if (q.includes('avez') || q.includes('cherche')) {
          responseText = `J'ai trouvé ces produits: ${matchedProducts[0].name}. Puis-je vous aider avec autre chose?`;
        } else {
          responseText = `I found some ${matchedProducts[0].category.name.toLowerCase()} items for you! Our ${matchedProducts[0].name} is a great choice. Is there anything else you need?`;
        }
      } else {
        responseText = q.includes('mufite') 
          ? "Ntabwo mbonye ibyo mwashakaga. Mwagerageza gushakisha ukundi?"
          : "I'm sorry, I couldn't find exactly what you're looking for. Would you like to try a different search?";
      }
    }

    return NextResponse.json({
      response: responseText,
      products: matchedProducts.map(p => ({
        ...p,
        category: p.category.name
      })),
      model: process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "Simba Search v2 (Local)"
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}
