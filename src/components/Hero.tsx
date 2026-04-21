'use client';

import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { ArrowRight, Truck, Shield, Star, Zap, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  onShopNow: () => void;
}

const SLIDES = [
  {
    headline: ['Fresh &', 'Quality', 'Products'],
    sub: 'Delivered to your door in Kigali within 24 hours',
    emoji: '🥬',
    accent: 'from-emerald-400 to-cyan-500',
    bg: 'bg-emerald-50/50',
    darkBg: 'bg-slate-900',
  },
  {
    headline: ['Premium', 'Personal', 'Care'],
    sub: 'Top global brands at the best prices in Rwanda',
    emoji: '🧴',
    accent: 'from-rose-400 to-pink-600',
    bg: 'bg-rose-50/50',
    darkBg: 'bg-slate-900',
  },
  {
    headline: ['Chilled', 'Drinks &', 'Beverages'],
    sub: 'Wines, spirits and soft drinks ready to serve',
    emoji: '🍺',
    accent: 'from-amber-400 to-orange-600',
    bg: 'bg-amber-50/50',
    darkBg: 'bg-slate-900',
  },
];

const STATS = [
  { value: '1.2k+', label: 'Products' },
  { value: '15+', label: 'Categories' },
  { value: 'Fast', label: 'Delivery' },
  { value: 'Best', label: 'Prices' },
];

export default function Hero({ onShopNow }: HeroProps) {
  const { darkMode, language } = useStore();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = SLIDES[index];

  return (
    <div className="relative space-y-6 mb-12">
      {/* Background Layer */}
      <div className={`absolute inset-0 rounded-[2.5rem] md:rounded-[3rem] transition-colors duration-1000 ${
        darkMode ? 'bg-slate-900' : 'bg-slate-50'
      }`} />

      {/* Main Content Card */}
      <div className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] border transition-all duration-700 ${
        darkMode ? 'border-slate-800 shadow-2xl' : 'border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
      }`}>
        
        {/* Animated Background Gradients */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 bg-gradient-to-br ${current.bg} opacity-100`}
          />
        </AnimatePresence>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 p-6 md:p-16 min-h-[500px] lg:min-h-[450px] items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 md:mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Simba Supermarket Online
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-4"
              >
                <h1 className={`text-4xl md:text-7xl font-black leading-[0.95] md:leading-[0.9] tracking-tight ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {current.headline.map((line, i) => (
                    <span key={i} className="block">
                      {i === 1 ? (
                        <span className={`bg-gradient-to-r ${current.accent} bg-clip-text text-transparent`}>
                          {line}
                        </span>
                      ) : line}
                    </span>
                  ))}
                </h1>
                <p className={`text-sm md:text-xl max-w-md font-medium leading-relaxed ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {current.sub}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onShopNow}
                className="group relative flex items-center justify-center gap-3 bg-slate-950 dark:bg-orange-600 text-white font-bold px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] shadow-2xl transition-all"
              >
                <span className="relative z-10 text-sm md:text-base">{t(language, 'shopNow')}</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                onClick={onShopNow}
                className={`flex items-center justify-center gap-2 px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] font-bold border-2 transition-all text-sm md:text-base ${
                  darkMode ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-900 hover:border-slate-300'
                }`}
              >
                Explore All
              </motion.button>
            </div>
          </div>

          {/* Right Column: Visual Elements */}
          <div className="flex items-center justify-center relative order-1 lg:order-2 py-4 md:py-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative"
              >
                {/* Visual Base */}
                <div className={`w-40 h-40 md:w-72 md:h-72 rounded-[2.5rem] md:rounded-[4rem] bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center text-[5rem] md:text-[10rem] select-none border border-white/50 dark:border-slate-700/50`}>
                  {current.emoji}
                </div>
                
                {/* Decorative floating badges - Adjusted for mobile */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 md:-top-6 md:-right-6 p-2 md:p-4 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 z-20"
                >
                  <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600">
                    <Sparkles className="w-3 h-3 md:w-5 md:h-5" />
                  </div>
                  <span className="text-[10px] md:text-sm font-black dark:text-white whitespace-nowrap">Fresh Daily</span>
                </motion.div>

                <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute -bottom-4 md:-bottom-10 -left-4 md:-left-10 p-2 md:p-4 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 md:gap-3 z-20"
                >
                  <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-green-100 dark:bg-green-500/20 text-green-600">
                    <Shield className="w-3 h-3 md:w-5 md:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] md:text-xs font-black dark:text-white leading-tight">Verified</span>
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-400">Quality Check</span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Progress Indicator */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="relative h-1.5 md:h-2 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === index ? (window?.innerWidth < 768 ? '30px' : '40px') : '8px', backgroundColor: darkMode ? '#334155' : '#E2E8F0' }}
            >
              {i === index && (
                <motion.div 
                  layoutId="progress"
                  className={`absolute inset-0 bg-gradient-to-r ${current.accent}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar: Optimized for mobile (scrollable if needed) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={`p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all ${
              darkMode 
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl' 
                : 'bg-white border-slate-100 hover:shadow-lg'
            }`}
          >
            <p className="text-xl md:text-2xl font-black tracking-tight text-orange-600">{stat.value}</p>
            <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-0.5 md:mt-1 ${
              darkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
