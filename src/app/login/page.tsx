'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const { darkMode, login, language } = useStore();
  const T = (key: string) => t(language, key);
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bg = darkMode ? 'bg-gray-950' : 'bg-orange-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const label = darkMode ? 'text-gray-400' : 'text-gray-500';
  const text = darkMode ? 'text-white' : 'text-gray-900';
  const inputBg = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500'
    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500';

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'register' && !form.name.trim()) e.name = T('nameRequired');
    if (!form.email.trim()) e.email = T('emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = T('invalidEmail');
    if (!form.password) e.password = T('passwordRequired');
    else if (form.password.length < 6) e.password = T('minChars');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || T('authFailed') });
        return;
      }

      login(data.user);
      router.push(data.user.role === 'ADMIN' || data.user.role === 'BRANCH_MANAGER' || data.user.role === 'BRANCH_STAFF' ? '/admin' : '/');
    } catch {
      setErrors({ general: T('somethingWrong') });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition ${inputBg} ${
      errors[field] ? '!border-red-400' : ''
    }`;

  return (
    <div className={`min-h-screen ${bg} flex flex-col`}>
      {/* Top bar */}
      <div className={`px-6 py-4 flex items-center justify-between`}>
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

          {/* Mode tabs */}
          <div className={`flex rounded-xl p-1 mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setErrors({}); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition ${
                  mode === m
                    ? 'bg-orange-500 text-white shadow'
                    : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'login' ? T('signIn') : T('signUp')}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (register only) */}
            {mode === 'register' && (
              <div>
                <label className={`text-xs font-semibold block mb-1.5 ${label}`}>{T('fullName')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={T('namePlaceholder')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass('name')}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`text-xs font-semibold block mb-1.5 ${label}`}>{T('emailAddress')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder={T('emailPlaceholderLogin')}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass('email')}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={`text-xs font-semibold block mb-1.5 ${label}`}>{T('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'register' ? T('passwordPlaceholderRegister') : T('passwordPlaceholderLogin')}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputClass('password')} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Forgot password */}
            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                  {T('forgotPassword')}
                </button>
              </div>
            )}

            {errors.general && <p className="text-red-400 text-xs text-center">{errors.general}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white py-3.5 rounded-2xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30 mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {mode === 'login' ? T('signingIn') : T('creatingAccount')}</>
              ) : (
                mode === 'login' ? T('signIn') : T('createAccount')
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <span className={`text-xs ${label}`}>{T('orContinueAs')}</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>

          {/* Guest */}
          <Link href="/">
            <button className={`w-full py-3 rounded-2xl border font-semibold text-sm transition ${
              darkMode
                ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}>
              👋 {T('guestBrowse')}
            </button>
          </Link>

          {/* Switch mode */}
          <p className={`text-center text-sm mt-6 ${label}`}>
            {mode === 'login' ? T('dontHaveAccount') + ' ' : T('alreadyHaveAccount') + ' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }}
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              {mode === 'login' ? T('signUp') : T('signIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
