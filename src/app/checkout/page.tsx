'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Branch } from '@/lib/types';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  Smartphone,
  Clock,
  MapPin,
  ShoppingBag,
  Info,
  Star,
  AlertCircle
} from 'lucide-react';

type Step = 'branch' | 'deposit' | 'processing' | 'success';

const BASE_DEPOSIT = 500;
const NO_SHOW_PENALTY = 1000;

export default function CheckoutPage() {
  const { darkMode, language, cart, cartTotal, clearCart, user } = useStore();
  const T = (key: string) => t(language, key);
  
  // Calculate dynamic deposit based on no-show flags
  const depositAmount = user ? BASE_DEPOSIT + (user.noShowFlags * NO_SHOW_PENALTY) : BASE_DEPOSIT;

  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState<Step>('branch');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('');
  const [momoPhone, setMomoPhone] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingBranches, setLoadingBranches] = useState(true);
  const router = useRouter();

  const total = cartTotal();
  const formatted = (n: number) => new Intl.NumberFormat('en-RW').format(n);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    fetch('/api/branches')
      .then(res => res.json())
      .then(data => {
        setBranches(data);
        setLoadingBranches(false);
      });
  }, []);

  if (!user) return null;

  const validateBranchStep = () => {
    const e: Record<string, string> = {};
    if (!selectedBranch) e.branch = T('pleaseSelectBranch');
    if (!pickupTime) e.time = T('pleaseSelectTime');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceedToDeposit = () => {
    if (!validateBranchStep()) return;
    setStep('deposit');
  };

  const handlePlaceOrder = async () => {
    if (!momoPhone) {
      setErrors({ momoPhone: T('required') });
      return;
    }

    setStep('processing');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          branchId: selectedBranch,
          items: cart,
          total: total + depositAmount,
          depositAmount: depositAmount,
          pickupTime: new Date(new Date().setHours(parseInt(pickupTime.split(':')[0]), 0, 0, 0)).toISOString(),
        }),
      });

      if (res.ok) {
        setTimeout(() => {
          clearCart();
          setStep('success');
        }, 2000);
      } else {
        setErrors({ general: T('failedOrder') });
        setStep('deposit');
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: T('somethingWrong') });
      setStep('deposit');
    }
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <Navbar onCartOpen={() => setCartOpen(true)} searchQuery="" onSearchChange={() => {}} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <ShoppingBag className={`w-20 h-20 mx-auto mb-6 ${darkMode ? 'text-slate-800' : 'text-slate-200'}`} />
          <p className={`text-xl font-medium mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            {T('cartEmpty')}
          </p>
          <Link href="/">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold transition shadow-lg shadow-orange-500/20">
              {T('continueShopping')}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <Navbar onCartOpen={() => setCartOpen(true)} searchQuery="" onSearchChange={() => {}} />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h1 className={`text-3xl font-black tracking-tighter mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {T('orderSuccess')}
          </h1>
          <p className={`mb-12 font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {T('orderSuccessMsg')}
          </p>

          <div className={`p-8 rounded-[2.5rem] border text-left mb-12 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
            <h3 className="text-xl font-black tracking-tight mb-2">{T('rateExperience')}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">{T('helpOthers')}</p>

            <div className="space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      rating >= star ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
              <textarea
                placeholder={T('rateExperience') + '...'}
                className={`w-full p-6 rounded-[2rem] border-2 outline-none transition-all h-32 resize-none text-sm ${
                  darkMode ? 'bg-slate-800 border-slate-700 focus:border-orange-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500'
                }`}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button
                onClick={async () => {
                  if (!rating) return alert(T('pleaseSelectRating'));
                  await fetch('/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      branchId: selectedBranch,
                      name: user.name,
                      rating,
                      text: reviewText,
                    })
                  });
                  router.push('/');
                }}
                className="w-full bg-slate-950 dark:bg-orange-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs"
              >
                {T('submitReviewHome')}
              </button>
            </div>
          </div>

          <Link href="/">
            <button className="bg-slate-900 dark:bg-slate-800 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:shadow-2xl">
              {T('backToShopping')}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
            <Smartphone className="absolute inset-0 m-auto w-10 h-10 text-orange-500" />
          </div>
          <p className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {T('processingMomo')}
          </p>
          <p className={`text-sm mt-2 font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {T('momoInstruction')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar onCartOpen={() => setCartOpen(true)} searchQuery="" onSearchChange={() => {}} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-10">
          <Link href="/" className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-4 hover:text-orange-500 transition ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <ArrowLeft className="w-3 h-3" />
            {T('continueShopping')}
          </Link>
          <h1 className="text-4xl font-black tracking-tighter">{T('secureCheckout')}</h1>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Main Flow */}
          <div className="lg:col-span-8 space-y-6">

            {/* Step 1: Branch Selection */}
            <div className={`p-8 rounded-[2.5rem] border shadow-sm ${
              step === 'branch'
                ? darkMode ? 'bg-slate-900 border-orange-500/30' : 'bg-white border-orange-200'
                : darkMode ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-100 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                  step === 'branch' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>1</div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">{T('pickupBranchTime')}</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{T('selectWhenWhere')}</p>
                </div>
              </div>

              {step === 'branch' && (
                <div className="space-y-8">
                  {/* Branch Selector */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {loadingBranches ? (
                      Array(6).fill(0).map((_, i) => (
                        <div key={i} className={`h-24 rounded-2xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                      ))
                    ) : (
                      branches.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBranch(b.id)}
                          className={`flex flex-col p-5 rounded-3xl border-2 text-left transition-all ${
                            selectedBranch === b.id
                              ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-500/5'
                              : darkMode ? 'border-slate-800 hover:border-slate-700 bg-slate-800/50' : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <MapPin className={`w-4 h-4 ${selectedBranch === b.id ? 'text-orange-500' : 'text-slate-400'}`} />
                            <div className="flex items-center gap-1">
                               <Star className={`w-3 h-3 ${b.rating > 0 ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />
                               <span className="text-[10px] font-black">{b.rating.toFixed(1)}</span>
                               <span className="text-[10px] text-slate-400 font-bold">({b.reviewCount})</span>
                            </div>
                          </div>
                          <span className={`text-sm font-black tracking-tight ${selectedBranch === b.id ? 'text-orange-600' : ''}`}>{b.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{b.location}</span>
                        </button>
                      ))
                    )}
                  </div>
                  {errors.branch && <p className="text-red-500 text-xs font-bold">{errors.branch}</p>}

                  {/* Time Selector */}
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {T('selectPickupTime')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setPickupTime(time)}
                          className={`px-6 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                            pickupTime === time
                              ? 'border-orange-500 bg-orange-500 text-white'
                              : darkMode ? 'border-slate-800 hover:border-slate-700 bg-slate-800/50' : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {errors.time && <p className="text-red-500 text-xs font-bold">{errors.time}</p>}
                  </div>

                  <button
                    onClick={handleProceedToDeposit}
                    className="w-full bg-slate-900 dark:bg-orange-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all hover:shadow-2xl hover:scale-[1.02]"
                  >
                    {T('confirmSelection')} →
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: MoMo Deposit */}
            <div className={`p-8 rounded-[2.5rem] border shadow-sm ${
              step === 'deposit'
                ? darkMode ? 'bg-slate-900 border-orange-500/30' : 'bg-white border-orange-200'
                : darkMode ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-100 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                  step === 'deposit' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>2</div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">{T('momoDeposit')}</h2>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{T('requiredToConfirm')}</p>
                </div>
              </div>

              {step === 'deposit' && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-3xl border-2 border-dashed ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-orange-50/50 border-orange-100'}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                        <Info className="w-6 h-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm">{T('whyDeposit')}</p>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          {T('depositExplain').replace('{amount}', String(depositAmount))}
                        </p>
                        {user.noShowFlags > 0 && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                              <AlertCircle className="w-3 h-3" /> High Risk Account
                            </p>
                            <p className="text-[9px] text-red-500 font-bold mt-1">
                              Due to {user.noShowFlags} previous no-show(s), your required deposit has been increased.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">{T('momoPhoneLabel')}</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        placeholder={T('momoPhonePlaceholder')}
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all ${
                          darkMode ? 'bg-slate-800 border-slate-700 focus:border-orange-500' : 'bg-white border-slate-100 focus:border-orange-500'
                        }`}
                        value={momoPhone}
                        onChange={(e) => setMomoPhone(e.target.value)}
                      />
                    </div>
                    {errors.momoPhone && <p className="text-red-500 text-xs font-bold">{errors.momoPhone}</p>}
                    {errors.general && <p className="text-red-500 text-xs font-bold">{errors.general}</p>}
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all hover:shadow-2xl shadow-lg shadow-orange-500/20"
                  >
                    {T('payAndOrder').replace('{amount}', String(depositAmount))}
                  </button>

                  <button
                    onClick={() => setStep('branch')}
                    className={`w-full py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {T('changeBranchTime')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Summary */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className={`p-8 rounded-[2.5rem] border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <h3 className="text-xl font-black tracking-tight mb-6 flex items-center justify-between">
                {T('summary')}
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">
                  {cart.reduce((s, i) => s + i.quantity, 0)} {T('itemsLabel')}
                </span>
              </h3>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-2 scrollbar-hide mb-8">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 items-center">
                    <div className={`relative w-14 h-14 rounded-2xl overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-50'} shrink-0 border border-slate-100 dark:border-slate-800`}>
                      <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-2" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-black tracking-tight line-clamp-1 uppercase ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {item.product.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{T('quantity')}: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-orange-600 shrink-0">
                      {formatted(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`space-y-3 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-400">{T('subtotal')}</span>
                  <span className={darkMode ? 'text-white' : 'text-slate-900'}>{formatted(total)} RWF</span>
                </div>
                {step === 'deposit' && (
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-400">{T('momoDeposit')}</span>
                    <span className="text-orange-500">+{formatted(depositAmount)} RWF</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-400">{T('pickupBranch')}</span>
                  <span className="text-green-500">{T('pickupFree')}</span>
                </div>
                <div className={`flex justify-between font-black text-lg pt-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className="tracking-tighter">{T('totalDue')}</span>
                  <span className="text-orange-600 tracking-tighter">
                    {formatted(total + (step === 'deposit' ? depositAmount : 0))} RWF
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Info Preview */}
            {selectedBranch && (
              <div className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{T('branch')}</p>
                      <p className="text-xs font-bold">{branches.find(b => b.id === selectedBranch)?.name}</p>
                    </div>
                  </div>
                  {pickupTime && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{T('pickupTime')}</p>
                        <p className="text-xs font-bold">{T('today')}, {pickupTime}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
