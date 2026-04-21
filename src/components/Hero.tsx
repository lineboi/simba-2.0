'use client';

import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { ArrowRight, Truck, Shield, Star, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroProps {
  onShopNow: () => void;
}

const SLIDES = [
  {
    headline: ['Fresh &', 'Quality', 'Products'],
    sub: 'Delivered to your door in Kigali within 24 hours',
    emoji: '🥬',
    accent: 'from-orange-500 to-amber-400',
    bg: 'from-orange-50 via-amber-50 to-orange-100',
    darkBg: 'from-gray-800 via-gray-900 to-gray-800',
  },
  {
    headline: ['Cosmetics &', 'Personal', 'Care'],
    sub: 'Top brands at the best prices in Rwanda',
    emoji: '🧴',
    accent: 'from-pink-500 to-rose-400',
    bg: 'from-pink-50 via-rose-50 to-pink-100',
    darkBg: 'from-gray-800 via-gray-900 to-gray-800',
  },
  {
    headline: ['Drinks &', 'Beverages', 'Delivered'],
    sub: 'Cold beers, wines & soft drinks at your doorstep',
    emoji: '🍺',
    accent: 'from-amber-500 to-yellow-400',
    bg: 'from-amber-50 via-yellow-50 to-amber-100',
    darkBg: 'from-gray-800 via-gray-900 to-gray-800',
  },
  {
    headline: ['Baby &', 'Family', 'Essentials'],
    sub: 'Everything your family needs, all in one place',
    emoji: '👶',
    accent: 'from-blue-500 to-cyan-400',
    bg: 'from-blue-50 via-cyan-50 to-blue-100',
    darkBg: 'from-gray-800 via-gray-900 to-gray-800',
  },
];

const STATS = [
  { value: '789+', label: 'Products' },
  { value: '10', label: 'Categories' },
  { value: '24h', label: 'Delivery' },
  { value: '100%', label: 'Quality' },
];

const MARQUEE_ITEMS = [
  '🥬 Fresh Food', '🧴 Cosmetics', '🍺 Drinks', '👶 Baby Care',
  '🍳 Kitchenware', '🧹 Cleaning', '🐾 Pet Care', '🏃 Wellness',
  '🥬 Fresh Food', '🧴 Cosmetics', '🍺 Drinks', '👶 Baby Care',
  '🍳 Kitchenware', '🧹 Cleaning', '🐾 Pet Care', '🏃 Wellness',
];

export default function Hero({ onShopNow }: HeroProps) {
  const { darkMode, language } = useStore();
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [counted, setCounted] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setSlide((s) => (s + 1) % SLIDES.length);
        setAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setCounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const current = SLIDES[slide];

  return (
    <div className="mb-10 space-y-4">
      {/* Main Hero */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${darkMode ? current.darkBg : current.bg} transition-all duration-700`}>
        {/* Animated blobs */}
        <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${current.accent} opacity-20 rounded-full animate-blob`} />
        <div className={`absolute -bottom-16 -left-16 w-64 h-64 bg-gradient-to-br ${current.accent} opacity-10 rounded-full animate-blob`} style={{ animationDelay: '3s' }} />

        {/* Spin ring */}
        <div className={`absolute top-6 right-6 w-32 h-32 rounded-full border-4 border-dashed border-orange-300/30 animate-spin-slow`} />

        <div className="relative z-10 grid md:grid-cols-2 gap-6 p-8 md:p-12 min-h-[340px] items-center">
          {/* Left content */}
          <div className={`transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 bg-gradient-to-r ${current.accent} text-white shadow-lg animate-slide-in-left`}>
              <Zap className="w-3 h-3" />
              Rwanda&apos;s #1 Online Supermarket
            </div>

            {/* Headline */}
            <h1 className={`text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {current.headline.map((line, i) => (
                <span
                  key={i}
                  className={`block animate-slide-up opacity-0`}
                  style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  {i === 1 ? <span className="gradient-text">{line}</span> : line}
                </span>
              ))}
            </h1>

            <p className={`text-sm sm:text-base md:text-lg mb-7 animate-fade-in delay-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {current.sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 animate-slide-up delay-400" style={{ animationFillMode: 'forwards' }}>
              <button
                onClick={onShopNow}
                className="shimmer-btn inline-flex items-center justify-center gap-2 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
              >
                {t(language, 'shopNow')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onShopNow}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold border-2 transition hover:scale-105 ${
                  darkMode ? 'border-gray-600 text-gray-300 hover:border-orange-500' : 'border-gray-200 text-gray-700 hover:border-orange-400'
                }`}
              >
                View Products
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-5 mt-7">
              <div className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Truck className="w-4 h-4 text-orange-500" />
                Free delivery in Kigali
              </div>
              <div className={`flex items-center gap-1.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Shield className="w-4 h-4 text-orange-500" />
                Quality guaranteed
              </div>
            </div>
          </div>

          {/* Right — floating emoji card */}
          <div className="hidden md:flex items-center justify-center relative h-64">
            {/* Main emoji */}
            <div className={`w-40 h-40 rounded-3xl shadow-2xl flex items-center justify-center text-8xl animate-float ${darkMode ? 'bg-gray-700' : 'bg-white'} transition-all duration-500`}>
              {current.emoji}
            </div>

            {/* Floating mini cards */}
            <div className={`absolute top-2 left-8 px-3 py-2 rounded-2xl shadow-lg flex items-center gap-2 animate-float-delay glass ${darkMode ? 'bg-gray-700/90' : 'bg-white/90'}`}>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Top Rated</span>
            </div>
            <div className={`absolute bottom-4 right-4 px-3 py-2 rounded-2xl shadow-lg flex items-center gap-2 animate-float-delay-2 glass ${darkMode ? 'bg-gray-700/90' : 'bg-white/90'}`}>
              <Truck className="w-4 h-4 text-orange-500" />
              <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Fast Delivery</span>
            </div>
            <div className={`absolute top-16 right-2 px-3 py-2 rounded-2xl shadow-lg flex items-center gap-2 animate-float glass ${darkMode ? 'bg-gray-700/90' : 'bg-white/90'}`}>
              <span className="text-sm">🎉</span>
              <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Best Prices</span>
            </div>

            {/* Ping dot */}
            <div className="absolute top-0 right-16">
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping-slow" />
                <div className="absolute inset-0.5 bg-orange-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-orange-500' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3`}>
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-4 text-center animate-slide-up opacity-0 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'} shadow-sm`}
            style={{ animationDelay: `${i * 0.1 + 0.3}s`, animationFillMode: 'forwards' }}
          >
            <div className={`text-2xl font-extrabold gradient-text ${counted ? 'animate-count-up' : ''}`}>
              {stat.value}
            </div>
            <div className={`text-xs mt-0.5 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Marquee strip */}
      <div className={`rounded-2xl overflow-hidden py-3 ${darkMode ? 'bg-gray-800' : 'bg-orange-500'}`}>
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className={`text-sm font-semibold shrink-0 ${darkMode ? 'text-orange-400' : 'text-white'}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
