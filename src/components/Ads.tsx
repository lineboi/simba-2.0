'use client';

import { Sparkles, ArrowRight, Gift, Zap, Timer, Percent } from 'lucide-react';
import { useStore } from '@/lib/store';
import Link from 'next/link';

export default function Ads() {
  const { darkMode } = useStore();

  const activeAds = [
    {
      id: 1,
      title: 'Weekend Mega Sale',
      desc: 'Get up to 40% off on all Food Products this Saturday & Sunday.',
      tag: 'Limited Time',
      icon: <Timer className="w-4 h-4" />,
      color: 'from-orange-500 to-amber-500',
      action: 'Shop Now'
    },
    {
      id: 2,
      title: 'Simba Fresh Prime',
      desc: 'Join our loyalty program and get free express delivery on every order.',
      tag: 'New',
      icon: <Zap className="w-4 h-4" />,
      color: 'from-purple-500 to-indigo-600',
      action: 'Learn More'
    },
    {
      id: 3,
      title: 'Baby Care Week',
      desc: 'Extra 15% discount on all baby essentials and milk formulas.',
      tag: 'Offer',
      icon: <Gift className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500',
      action: 'View Deals'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Ad Cards */}
      {activeAds.map((ad, i) => (
        <div 
          key={ad.id}
          className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${
            darkMode ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-orange-100'
          }`}
        >
          {/* Accent Stripe */}
          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${ad.color}`} />
          
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${ad.color}`}>
                {ad.icon}
                {ad.tag}
              </span>
              <Sparkles className="w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <h3 className={`font-bold text-sm mb-2 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {ad.title}
            </h3>
            <p className={`text-xs leading-relaxed mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {ad.desc}
            </p>

            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors">
              {ad.action}
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Decorative Background Element */}
          <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl opacity-10 bg-gradient-to-br ${ad.color}`} />
        </div>
      ))}

      {/* Featured Brands / Small Ads */}
      <div className={`rounded-2xl p-5 border border-dashed ${darkMode ? 'border-gray-800 bg-gray-900/40' : 'border-gray-200 bg-gray-50/50'}`}>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Featured Partners
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-10 rounded-lg flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer ${
                darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
              }`}
            >
              <div className="w-12 h-2 bg-gray-400/30 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badge */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
          <Percent className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className={`text-[10px] font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Best Price Guarantee
          </p>
          <p className="text-[9px] text-gray-500">Find it cheaper? We match it.</p>
        </div>
      </div>
    </div>
  );
}
