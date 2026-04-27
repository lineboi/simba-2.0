import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const { branchId } = await params;

    const staff = await prisma.user.findMany({
      where: { 
        branchId,
        role: 'BRANCH_STAFF'
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching branch staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}
