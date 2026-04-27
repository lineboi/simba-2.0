'use client';

import { useState, Suspense } from 'react';
import { useStore } from '@/lib/store';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

function ResetForm() {
  const { darkMode, login } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const bg = darkMode ? 'bg-gray-950' : 'bg-orange-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const inputBg = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500';

  if (!token) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center px-4`}>
        <div className={`w-full max-w-md rounded-3xl border shadow-xl p-8 ${card} text-center`}>
          <p className="text-red-500 font-semibold mb-4">Invalid or missing reset link.</p>
          <Link href="/forgot-password">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold text-sm">
              Request a new link
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      login(data.user);
      setDone(true);
      setTimeout(() => router.push('/'), 2000);
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
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${text}`}>Password updated!</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Redirecting you to the store...
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-orange-500" />
                </div>
                <h1 className={`text-2xl font-extrabold ${text}`}>Set new password</h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Choose a strong password for your account.
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition ${inputBg}`} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPw ? 'text' : 'password'} placeholder="Repeat your password"
                      value={confirm} onChange={(e) => setConfirm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition ${inputBg}`} />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white py-3.5 rounded-2xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
