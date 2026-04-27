import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { branchId, name, rating, text } = await request.json();

    const review = await prisma.review.create({
      data: {
        branchId,
        name,
        rating: parseInt(rating),
        text,
        avatar: name[0].toUpperCase(),
        color: 'from-orange-500 to-amber-500',
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        verified: true,
      },
    });

    // Update branch rating
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: { reviews: true }
    });

    if (branch) {
      const avgRating = branch.reviews.reduce((acc, r) => acc + r.rating, 0) / branch.reviews.length;
      await prisma.branch.update({
        where: { id: branchId },
        data: {
          rating: avgRating,
          reviewCount: branch.reviews.length
        }
      });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Failed to post review' }, { status: 500 });
  }
}
