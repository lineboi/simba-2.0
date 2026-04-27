import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        branch: true,
        items: {
          include: {
            product: true,
          },
        },
        assignedStaff: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
