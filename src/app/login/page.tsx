'use client';

import { useState, useEffect, Suspense } from 'react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';

type Mode = 'login' | 'register';

const GOOGLE_ERRORS: Record<string, string> = {
  google_cancelled: 'Google sign-in was cancelled.',
  google_failed: 'Google sign-in failed. Please try again.',
  google_no_email: 'Could not get your email from Google.',
  google_not_configured: 'Google sign-in is not available right now.',
};

function LoginForm() {
  const { darkMode, login, language } = useStore();
  const T = (key: string) => t(language, key);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError && GOOGLE_ERRORS[oauthError]) {
      setError(GOOGLE_ERRORS[oauthError]);
    }
  }, [searchParams]);

  const bg = darkMode ? 'bg-gray-950' : 'bg-orange-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const label = darkMode ? 'text-gray-400' : 'text-gray-500';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const inputBg = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'register' && !form.name.trim()) { setError(T('nameRequired')); return; }
    if (!form.email.trim()) { setError(T('emailRequired')); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError(T('invalidEmail')); return; }
    if (!form.password) { setError(T('passwordRequired')); return; }
    if (form.password.length < 6) { setError(T('minChars')); return; }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? T('authFailed'));
        return;
      }

      login(data.user);
      router.push(
        data.user.role === 'ADMIN' || data.user.role === 'BRANCH_MANAGER' || data.user.role === 'BRANCH_STAFF'
          ? '/admin'
          : '/'
      );
    } catch {
      setError(T('somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setGoogleLoading(true);
    window.location.href = '/api/auth/google';
  };

  const inputClass = `w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition ${inputBg}`;

  return (
    <div className={`min-h-screen ${bg} flex flex-col`}>
      {/* Top bar */}
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
        <Link href="/" className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>
          <ArrowLeft className="w-4 h-4" />
          {T('backToShop')}
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className={`w-full max-w-md rounded-3xl border shadow-xl p-8 ${card}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛒</span>
            </div>
            <h1 className={`text-2xl font-extrabold ${text}`}>
              {mode === 'login' ? T('welcomeBack') : T('createAccount')}
            </h1>
            <p className={`text-sm mt-1 ${label}`}>
              {mode === 'login' ? T('signInToSimba') : T('joinSupermarket')}
            </p>
          </div>

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-2xl border font-semibold text-sm transition mb-5 ${
              darkMode
                ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-white'
                : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm'
            } disabled:opacity-60`}
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <span className={`text-xs ${label}`}>or with email</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>

          {/* Mode tabs */}
          <div className={`flex rounded-xl p-1 mb-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  mode === m
                    ? 'bg-orange-500 text-white shadow'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'login' ? T('signIn') : T('signUp')}
              </button>
            ))}
          </div>

          {/* Error / Success banners */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            {mode === 'register' && (
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${label}`}>{T('fullName')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder={T('namePlaceholder')} value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass} />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`text-xs font-semibold block mb-1.5 ${label}`}>{T('emailAddress')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" placeholder={T('emailPlaceholderLogin')} value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`text-xs font-semibold ${label}`}>{T('password')}</label>
                {mode === 'login' && (
                  <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                    {T('forgotPassword')}
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'register' ? T('passwordPlaceholderRegister') : T('passwordPlaceholderLogin')}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass} pr-10`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white py-3.5 rounded-2xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30 mt-2">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> {mode === 'login' ? T('signingIn') : T('creatingAccount')}</>
                : mode === 'login' ? T('signIn') : T('createAccount')
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <span className={`text-xs ${label}`}>{T('orContinueAs')}</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>

          {/* Guest */}
          <Link href="/">
            <button className={`w-full py-3 rounded-2xl border font-semibold text-sm transition ${
              darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}>
              👋 {T('guestBrowse')}
            </button>
          </Link>

          {/* Switch mode */}
          <p className={`text-center text-sm mt-5 ${label}`}>
            {mode === 'login' ? T('dontHaveAccount') + ' ' : T('alreadyHaveAccount') + ' '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
              className="text-orange-500 font-semibold hover:text-orange-600">
              {mode === 'login' ? T('signUp') : T('signIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
