import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth-jwt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        role: 'CUSTOMER',
      },
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name ?? '',
      role: user.role,
      branchId: user.branchId,
    };

    const token = await signToken(sessionUser);
    const cookieHeader = setSessionCookie(token);

    return NextResponse.json(
      { user: sessionUser },
      { status: 201, headers: { 'Set-Cookie': cookieHeader } }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
