'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { darkMode } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const bg = darkMode ? 'bg-gray-950' : 'bg-orange-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const inputBg = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${bg} flex flex-col`}>
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <div className={`font-bold text-lg leading-tight ${text}`}>Simba</div>
            <div className="text-xs text-orange-500 leading-tight">Supermarket</div>
          </div>
        </Link>
        <Link href="/login" className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className={`w-full max-w-md rounded-3xl border shadow-xl p-8 ${card}`}>
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${text}`}>Check your email</h2>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                If <strong>{email}</strong> has an account, we sent a password reset link. Check your inbox and spam folder.
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                The link expires in 1 hour.
              </p>
              <Link href="/login">
                <button className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-bold text-sm transition">
                  Back to login
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-orange-500" />
                </div>
                <h1 className={`text-2xl font-extrabold ${text}`}>Forgot password?</h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white py-3.5 rounded-2xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Reset Link'}
                </button>
              </form>

              <p className={`text-center text-sm mt-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Remember your password?{' '}
                <Link href="/login" className="text-orange-500 font-semibold hover:text-orange-600">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
