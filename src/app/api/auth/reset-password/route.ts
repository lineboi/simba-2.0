import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth-jwt';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token) return NextResponse.json({ error: 'Reset token is required' }, { status: 400 });
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 });
    }
    if (resetToken.used) {
      return NextResponse.json({ error: 'This reset link has already been used' }, { status: 400 });
    }
    if (new Date() > resetToken.expiresAt) {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashed },
    });

    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name ?? '',
      role: user.role,
      branchId: user.branchId,
    };

    const jwt = await signToken(sessionUser);
    const cookieHeader = setSessionCookie(jwt);

    return NextResponse.json(
      { user: sessionUser },
      { headers: { 'Set-Cookie': cookieHeader } }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
