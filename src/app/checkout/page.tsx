'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Image from 'next/image';
import Link from 'next/link';
import { getProductImage } from '@/lib/productImages';
import { ArrowLeft, CheckCircle, Smartphone, Banknote, Loader2, ShoppingBag } from 'lucide-react';

type Step = 'details' | 'payment' | 'processing' | 'success';

export default function CheckoutPage() {
  const { darkMode, language, cart, cartTotal, clearCart } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [step, setStep] = useState<Step>('details');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'cod'>('momo');
  const [form, setForm] = useState({ name: '', address: '', phone: '', momoPhone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = cartTotal();
  const formatted = (n: number) => new Intl.NumberFormat('en-RW').format(n);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (paymentMethod === 'momo' && !form.momoPhone.trim()) e.momoPhone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceed = () => {
    if (!validate()) return;
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setStep('processing');
    setTimeout(() => {
      clearCart();
      setStep('success');
    }, 2500);
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <ShoppingBag className={`w-20 h-20 mx-auto mb-6 ${darkMode ? 'text-gray-700' : 'text-gray-200'}`} />
          <p className={`text-xl font-medium mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t(language, 'cartEmpty')}
          </p>
          <Link href="/">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold transition">
              {t(language, 'continueShopping')}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-14 h-14 text-orange-500" />
          </div>
          <h1 className={`text-2xl font-extrabold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t(language, 'orderSuccess')}
          </h1>
          <p className={`mb-8 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t(language, 'orderSuccessMsg')}
          </p>
          <Link href="/">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-orange-500/30">
              {t(language, 'backToShopping')}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-orange-500 animate-spin mx-auto mb-4" />
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {t(language, 'processing')}
          </p>
          {paymentMethod === 'momo' && (
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {t(language, 'momoInstruction')}
            </p>
          )}
        </div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition ${
      errors[field] ? 'border-red-400' : darkMode ? 'border-gray-700 focus:border-orange-500' : 'border-gray-200 focus:border-orange-500'
    } ${darkMode ? 'bg-gray-700 text-white placeholder-gray-500' : 'bg-white text-gray-900 placeholder-gray-400'}`;

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className={`inline-flex items-center gap-2 text-sm mb-6 hover:text-orange-500 transition ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <ArrowLeft className="w-4 h-4" />
          {t(language, 'continueShopping')}
        </Link>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {['details', 'payment'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s || (step === 'payment' && s === 'details')
                  ? 'bg-orange-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                {i + 1}
              </div>
              <span className={`text-sm font-medium capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{s}</span>
              {i < 1 && <div className={`flex-1 h-0.5 w-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Form */}
          <div className="md:col-span-3 space-y-4">
            {step === 'details' && (
              <div className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h2 className={`text-lg font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Delivery Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className={`text-xs font-semibold mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t(language, 'name')}
                    </label>
                    <input
                      className={inputClass('name')}
                      placeholder={t(language, 'enterName')}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className={`text-xs font-semibold mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t(language, 'address')}
                    </label>
                    <input
                      className={inputClass('address')}
                      placeholder={t(language, 'enterAddress')}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className={`text-xs font-semibold mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t(language, 'phone')}
                    </label>
                    <input
                      className={inputClass('phone')}
                      placeholder={t(language, 'enterPhoneNum')}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Payment method selection */}
                <h2 className={`text-lg font-bold mt-6 mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t(language, 'paymentMethod')}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('momo')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${
                      paymentMethod === 'momo'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                        : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className={`w-6 h-6 ${paymentMethod === 'momo' ? 'text-orange-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-semibold ${paymentMethod === 'momo' ? 'text-orange-500' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t(language, 'mobileMoney')}
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition ${
                      paymentMethod === 'cod'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                        : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-orange-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={`text-sm font-semibold ${paymentMethod === 'cod' ? 'text-orange-500' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t(language, 'cashOnDelivery')}
                    </span>
                  </button>
                </div>

                {paymentMethod === 'momo' && (
                  <div className="mt-4">
                    <label className={`text-xs font-semibold mb-1.5 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {t(language, 'phoneNumber')} (MTN / Airtel)
                    </label>
                    <input
                      className={inputClass('momoPhone')}
                      placeholder={t(language, 'enterPhone')}
                      value={form.momoPhone}
                      onChange={(e) => setForm({ ...form, momoPhone: e.target.value })}
                    />
                    {errors.momoPhone && <p className="text-red-400 text-xs mt-1">{errors.momoPhone}</p>}
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {t(language, 'momoInstruction')}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleProceed}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-orange-500/30"
                >
                  {t(language, 'checkout')} →
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className={`p-6 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {t(language, 'orderSummary')}
                </h2>
                <div className={`p-4 rounded-2xl mb-6 space-y-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex justify-between text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{t(language, 'name')}</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{form.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{t(language, 'address')}</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{form.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{t(language, 'paymentMethod')}</span>
                    <span className={`font-medium text-orange-500`}>
                      {paymentMethod === 'momo' ? t(language, 'mobileMoney') : t(language, 'cashOnDelivery')}
                    </span>
                  </div>
                  {paymentMethod === 'momo' && (
                    <div className="flex justify-between text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>MoMo #</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{form.momoPhone}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-base transition-all hover:shadow-lg hover:shadow-orange-500/30"
                >
                  {paymentMethod === 'momo' ? t(language, 'payWithMomo') : t(language, 'placeOrder')} — {formatted(total)} RWF
                </button>
                <button
                  onClick={() => setStep('details')}
                  className={`w-full mt-3 py-3 rounded-2xl font-medium text-sm transition ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ← Edit details
                </button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="md:col-span-2">
            <div className={`p-5 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm sticky top-24`}>
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t(language, 'orderSummary')} ({cart.reduce((s, i) => s + i.quantity, 0)} items)
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className={`relative w-12 h-12 rounded-xl overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} shrink-0`}>
                      <Image src={getProductImage(item.product.name, item.product.category)} alt={item.product.name} fill className="object-cover rounded-xl" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium line-clamp-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.product.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-orange-500 shrink-0">
                      {formatted(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className={`border-t pt-4 space-y-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{t(language, 'subtotal')}</span>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>{formatted(total)} RWF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{t(language, 'delivery')}</span>
                  <span className="text-orange-500 font-medium">{t(language, 'free')}</span>
                </div>
                <div className={`flex justify-between font-bold text-base pt-2 border-t ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
                  <span>{t(language, 'cartTotal')}</span>
                  <span>{formatted(total)} RWF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
