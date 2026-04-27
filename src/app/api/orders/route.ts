import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface OrderItemInput {
  product: {
    id: number;
    price: number;
  };
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const { userId, branchId, items, total, depositAmount, pickupTime } = await request.json();

    // 1. Create the order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          branchId,
          total,
          depositAmount,
          depositPaid: true, // Assuming mock payment success
          status: 'pending',
          pickupTime: new Date(pickupTime),
          items: {
            create: (items as OrderItemInput[]).map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // 2. Decrease stock at the branch
      for (const item of (items as OrderItemInput[])) {
        await tx.branchStock.update({
          where: {
            branchId_productId: {
              branchId,
              productId: item.product.id,
            },
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
