'use client';

import { ShoppingCart, Moon, Sun, Globe, Search, Menu, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Language } from '@/lib/types';
import { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onCartOpen: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const LANGS: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'rw', label: 'RW' },
];

export default function Navbar({ onCartOpen, searchQuery, onSearchChange }: NavbarProps) {
  const { darkMode, toggleDarkMode, language, setLanguage, cartCount } = useStore();
  const count = cartCount();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div className="hidden sm:block">
            <div className={`font-bold text-lg leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Simba</div>
            <div className="text-xs text-orange-500 leading-tight">Supermarket</div>
          </div>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t(language, 'search')}
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-orange-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500'
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`md:hidden p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* Language switcher */}
          <div className="flex items-center gap-0.5">
            <Globe className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`text-xs px-1.5 py-0.5 rounded font-medium transition ${
                  language === l.code
                    ? 'bg-orange-500 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className={`md:hidden px-4 pb-3 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t(language, 'search')}
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>
      )}
    </nav>
  );
}
