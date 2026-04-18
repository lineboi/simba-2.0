'use client';

import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { ArrowRight, Star, Truck, Shield } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  const { darkMode, language } = useStore();

  return (
    <div className={`relative overflow-hidden rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-orange-50 to-orange-100'} p-8 md:p-12 mb-8`}>
      <div className="relative z-10 max-w-lg">
        <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Star className="w-3 h-3 fill-white" />
          Rwanda&apos;s #1 Online Supermarket
        </div>
        <h1 className={`text-3xl md:text-5xl font-extrabold leading-tight mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t(language, 'heroTitle')}
        </h1>
        <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {t(language, 'heroSubtitle')}
        </p>
        <button
          onClick={onShopNow}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/30"
        >
          {t(language, 'shopNow')}
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-6 mt-8">
          <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Truck className="w-4 h-4 text-orange-500" />
            Free delivery in Kigali
          </div>
          <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Shield className="w-4 h-4 text-orange-500" />
            Quality guaranteed
          </div>
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -right-16 -top-16 w-72 h-72 bg-orange-400/20 rounded-full" />
      <div className="absolute -right-8 -bottom-12 w-48 h-48 bg-orange-500/20 rounded-full" />
      <div className={`absolute right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3`}>
        {['🥬', '🧴', '🍺', '👶'].map((emoji, i) => (
          <div
            key={i}
            className={`w-14 h-14 ${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-2xl shadow-lg flex items-center justify-center text-2xl`}
            style={{ transform: `translateX(${i % 2 === 0 ? '0' : '20px'})` }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
