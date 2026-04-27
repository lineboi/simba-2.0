import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const { branchId } = await params;

    const orders = await prisma.order.findMany({
      where: { branchId },
      include: {
        user: true,
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
    console.error('Error fetching branch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
