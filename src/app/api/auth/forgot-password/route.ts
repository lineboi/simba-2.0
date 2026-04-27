import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/db';
import { Resend } from 'resend';

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? '');
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return NextResponse.json({ success: true });
    }

    // Invalidate previous tokens for this email
    await prisma.passwordResetToken.updateMany({
      where: { email: user.email, used: false },
      data: { used: true },
    });

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email: user.email, token, expiresAt },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await resend.emails.send({
      from: 'Simba Supermarket <noreply@simba.rw>',
      to: user.email,
      subject: 'Reset your Simba password',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 48px; height: 48px; background: #EA580C; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
              <span style="color: white; font-weight: 900; font-size: 24px;">S</span>
            </div>
            <h1 style="font-size: 24px; font-weight: 900; margin: 16px 0 4px;">Simba Supermarket</h1>
            <p style="color: #EA580C; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Rwanda's #1 Online Supermarket</p>
          </div>

          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Reset your password</h2>
          <p style="color: #6B7280; line-height: 1.6; margin-bottom: 24px;">
            Hi ${user.name ?? 'there'}, we received a request to reset your password. Click the button below to choose a new one.
          </p>

          <a href="${resetUrl}" style="display: block; background: #EA580C; color: white; text-align: center; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 15px; margin-bottom: 24px;">
            Reset Password
          </a>

          <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6;">
            This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email — your password won't change.
          </p>

          <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 24px 0;" />
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            © 2026 Simba Supermarket · Kigali, Rwanda
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
