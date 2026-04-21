import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Order is already cancelled' }, { status: 400 });
    }

    // Check if within 30 minutes
    const now = new Date();
    const orderDate = new Date(order.createdAt);
    const diffInMinutes = (now.getTime() - orderDate.getTime()) / (1000 * 60);

    if (diffInMinutes > 30) {
      return NextResponse.json({ 
        error: 'Cancellation window expired. Orders can only be cancelled within 30 minutes of placement.' 
      }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });

    return NextResponse.json({ message: 'Order cancelled successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
