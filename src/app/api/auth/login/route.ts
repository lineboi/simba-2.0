import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth-jwt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json(
        { error: 'This account uses Google sign-in. Please use the Google button.' },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

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
      { headers: { 'Set-Cookie': cookieHeader } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
