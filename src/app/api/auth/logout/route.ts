import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth-jwt';

export async function POST() {
  return NextResponse.json(
    { success: true },
    { headers: { 'Set-Cookie': clearSessionCookie() } }
  );
}
