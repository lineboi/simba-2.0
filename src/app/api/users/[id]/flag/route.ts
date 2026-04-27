import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { orderId } = await request.json();

    // 1. Increment no-show flags for the user
    const user = await prisma.user.update({
      where: { id },
      data: {
        noShowFlags: {
          increment: 1,
        },
      },
    });

    // 2. Mark the order as cancelled due to no-show
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'cancelled',
        },
      });
    }

    return NextResponse.json({ success: true, noShowFlags: user.noShowFlags });
  } catch (error) {
    console.error('Flagging error:', error);
    return NextResponse.json({ error: 'Failed to flag user' }, { status: 500 });
  }
}
