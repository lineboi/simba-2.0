'use client';

import { Home, Grid, ShoppingCart, User, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BottomNav() {
  const { darkMode, cartCount, user } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const count = cartCount();

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Categories', icon: Grid, href: '/#categories' },
    { label: 'Cart', icon: ShoppingCart, href: '#cart', isCart: true },
    { label: 'Account', icon: User, href: user ? '/admin' : '/login' },
  ];

  return (
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] border-t backdrop-blur-lg px-2 pb-safe-area-inset-bottom ${
      darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.isCart) {
                  // This is handled by a global event or store state
                  // For now, let's just use a simple approach
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
              className={`relative flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 ${
                isActive ? 'text-orange-500' : darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-orange-500/10' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce-short' : ''}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
              
              {item.isCart && count > 0 && (
                <span className="absolute top-2 right-1/2 translate-x-3 w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <style jsx global>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s ease-in-out;
        }
        .pb-safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
