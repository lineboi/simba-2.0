'use client';

import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { ArrowRight, Zap, MapPin, Smartphone, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { categoryEmojis, categoryBgs } from '@/lib/categoryImages';

interface HeroProps {
  onShopNow: () => void;
  categories: string[];
  onCategoryClick: (cat: string) => void;
}

const VALUE_PROP_KEYS = [
  { icon: Zap, labelKey: 'vp1Label', subKey: 'vp1Sub', color: 'bg-orange-500' },
  { icon: MapPin, labelKey: 'vp2Label', subKey: 'vp2Sub', color: 'bg-green-500' },
  { icon: Smartphone, labelKey: 'vp3Label', subKey: 'vp3Sub', color: 'bg-yellow-500' },
  { icon: ShieldCheck, labelKey: 'vp4Label', subKey: 'vp4Sub', color: 'bg-blue-500' },
];

export default function Hero({ onShopNow, categories, onCategoryClick }: HeroProps) {
  const { darkMode, language } = useStore();
  const T = (key: string) => t(language, key);

  // Show up to 6 real categories in the showcase
  const showcaseCategories = categories.slice(0, 6);

  return (
    <section className="space-y-5">
      {/* ── MAIN HERO CARD ─────────────────────────────────── */}
      <div className={`relative overflow-hidden rounded-[2.5rem] border transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-700/60'
          : 'bg-gradient-to-br from-orange-50 via-amber-50 to-white border-orange-100'
      }`}>
        {/* Background blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-10 p-8 md:p-16 lg:p-20 items-center min-h-[480px]">

          {/* ── LEFT: Copy ───────────────────────────────────── */}
          <div className="flex flex-col items-start space-y-8 max-w-xl">

            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600 text-white text-[11px] font-black uppercase tracking-[0.18em] shadow-lg shadow-orange-600/25"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {T('heroEyebrow')}
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <h1 className={`text-5xl md:text-7xl xl:text-8xl font-black leading-[0.88] tracking-tighter ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {T('heroLine1')}
                <br />
                <span className="text-orange-600">{T('heroLine2')}</span>
              </h1>
              <p className={`mt-6 text-base md:text-lg font-medium leading-relaxed max-w-md ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {T('heroDesc')}
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={onShopNow}
                className="group flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-black text-sm uppercase tracking-widest px-10 py-5 rounded-2xl shadow-2xl shadow-orange-600/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                {T('startShopping')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#categories"
                className={`text-sm font-bold underline underline-offset-4 transition-colors ${
                  darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {T('exploreCategories')}
              </a>
            </motion.div>

            {/* Social proof micro-text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              {T('socialProof')}
            </motion.p>
          </div>

          {/* ── RIGHT: Dynamic category showcase ────────────── */}
          <div className="hidden lg:flex items-center justify-center pr-4">
            {showcaseCategories.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {showcaseCategories.map((cat, i) => {
                  const emoji = categoryEmojis[cat] ?? '🛒';
                  const bg = categoryBgs[cat] ?? 'bg-gray-100 dark:bg-gray-800/50';
                  return (
                    <motion.button
                      key={cat}
                      initial={{ opacity: 0, scale: 0.7, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.08, type: 'spring', bounce: 0.4 }}
                      whileHover={{ scale: 1.1, rotate: 4, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCategoryClick(cat)}
                      title={cat}
                      className={`${bg} relative rounded-[1.8rem] p-6 flex flex-col items-center gap-2 shadow-md cursor-pointer select-none w-28 h-28 transition-shadow hover:shadow-xl`}
                    >
                      <span className="text-4xl">{emoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-wide text-slate-600 dark:text-slate-400 text-center leading-tight line-clamp-1">
                        {cat.split(' ')[0]}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              /* Skeleton while categories load */
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[1.8rem] w-28 h-28 animate-pulse ${
                      darkMode ? 'bg-slate-800' : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── VALUE PROPS BAR ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {VALUE_PROP_KEYS.map(({ icon: Icon, labelKey, subKey, color }, i) => (
          <motion.div
            key={labelKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.07 }}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
              darkMode
                ? 'bg-slate-900 border-slate-800 hover:border-orange-500/30'
                : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.01]'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl ${color} text-white flex items-center justify-center shadow-lg shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-wide ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {T(labelKey)}
              </p>
              <p className="text-[10px] font-medium text-slate-400 mt-0.5">{T(subKey)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
