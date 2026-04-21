'use client';

import { Home, Grid, ShoppingCart, User, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '@/lib/translations';

export default function BottomNav() {
  const { darkMode, cartCount, user, language } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const count = cartCount();

  const navItems = [
    { label: t(language, 'home'), icon: Home, href: '/' },
    { label: t(language, 'categories'), icon: Grid, href: '/#categories' },
    { label: t(language, 'cart'), icon: ShoppingCart, href: '#cart', isCart: true },
    { label: t(language, 'account'), icon: User, href: user ? '/admin' : '/login' },
  ];

  return (
    <div className={`lg:hidden fixed bottom-6 left-4 right-6 z-[100] h-20 rounded-[2.5rem] border backdrop-blur-2xl px-2 shadow-2xl transition-all duration-500 ${
      darkMode 
        ? 'bg-slate-900/90 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
        : 'bg-white/90 border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
    }`}>
      <div className="flex items-center justify-around h-full relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.isCart) {
                  const event = new CustomEvent('open-cart');
                  window.dispatchEvent(event);
                } else if (item.href.startsWith('/#')) {
                  router.push('/');
                  setTimeout(() => {
                    const el = document.getElementById(item.href.substring(2));
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  router.push(item.href);
                }
              }}
              className="relative flex flex-col items-center justify-center w-full h-full group"
            >
              {/* Active Indicator Background */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-x-2 inset-y-3 bg-orange-500/10 rounded-3xl -z-10"
                  />
                )}
              </AnimatePresence>

              <motion.div
                whileTap={{ scale: 0.8 }}
                className={`relative p-2 transition-colors duration-300 ${
                  isActive ? 'text-orange-600' : darkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                
                {item.isCart && count > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900"
                  >
                    {count}
                  </motion.span>
                )}
              </motion.div>
              
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                isActive ? 'text-orange-600' : 'hidden'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
