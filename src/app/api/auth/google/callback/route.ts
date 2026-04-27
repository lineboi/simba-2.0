import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { signToken, setSessionCookie } from '@/lib/auth-jwt';

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=google_cancelled', appUrl));
  }

  const redirectUri = `${appUrl}/api/auth/google/callback`;

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(new URL('/login?error=google_failed', appUrl));
    }

    // Get user info
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userInfoRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=google_no_email', appUrl));
    }

    // Upsert user in DB
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.sub }, { email: googleUser.email }],
      },
    });

    if (user) {
      // Link Google ID if not yet linked
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleUser.sub, name: user.name ?? googleUser.name },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name ?? googleUser.email.split('@')[0],
          googleId: googleUser.sub,
          role: 'CUSTOMER',
        },
      });
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

    const response = NextResponse.redirect(new URL('/', appUrl));
    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/login?error=google_failed', appUrl));
  }
}
