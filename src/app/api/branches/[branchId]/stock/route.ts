import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const { branchId } = await params;
    const stock = await prisma.branchStock.findMany({
      where: { branchId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json(stock);
  } catch (error) {
    console.error('Error fetching branch stock:', error);
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const { branchId } = await params;
    const { productId, quantity } = await request.json();

    const updatedStock = await prisma.branchStock.update({
      where: {
        branchId_productId: {
          branchId,
          productId: Number(productId),
        },
      },
      data: {
        quantity: Number(quantity),
      },
    });

    return NextResponse.json(updatedStock);
  } catch (error) {
    console.error('Error updating branch stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}
