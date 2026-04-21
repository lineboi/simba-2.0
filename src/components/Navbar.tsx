'use client';

import { 
  ShoppingCart, 
  Moon, 
  Sun, 
  Globe, 
  Search, 
  X, 
  User, 
  LogOut, 
  LayoutGrid,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { Language } from '@/lib/types';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORY_META: Record<string, { emoji: string; color: string; desc: string }> = {
  'Food Products':             { emoji: '🥬', color: 'from-green-50 to-emerald-50 text-green-600', desc: 'Fresh groceries & daily essentials' },
  'Cosmetics & Personal Care': { emoji: '🧴', color: 'from-pink-50 to-rose-50 text-pink-600', desc: 'Beauty & skin care products' },
  'Cleaning & Sanitary':       { emoji: '🧹', color: 'from-blue-50 to-cyan-50 text-blue-600', desc: 'Keep your home sparkling clean' },
  'Alcoholic Drinks':          { emoji: '🍺', color: 'from-amber-50 to-yellow-50 text-amber-600', desc: 'Premium beers, wines & spirits' },
  'Baby Products':             { emoji: '👶', color: 'from-yellow-50 to-orange-50 text-orange-600', desc: 'Everything for your little ones' },
  'Kitchenware & Electronics': { emoji: '🍳', color: 'from-slate-50 to-gray-50 text-slate-600', desc: 'Modern tools for your kitchen' },
  'Kitchen Storage':           { emoji: '🫙', color: 'from-orange-50 to-amber-50 text-orange-600', desc: 'Organize your space elegantly' },
  'Sports & Fitness':          { emoji: '💪', color: 'from-red-50 to-orange-50 text-red-600', desc: 'Equipment for active lifestyle' },
  'Sports & Wellness':         { emoji: '🏃', color: 'from-teal-50 to-cyan-50 text-teal-600', desc: 'Health & wellness supplements' },
  'Stationery':                { emoji: '📚', color: 'from-indigo-50 to-purple-50 text-indigo-600', desc: 'Office & school supplies' },
  'Pet Care':                  { emoji: '🐾', color: 'from-orange-50 to-red-50 text-orange-600', desc: 'Only the best for your pets' },
  'General':                   { emoji: '🛒', color: 'from-gray-50 to-slate-50 text-slate-600', desc: 'Variety of household items' },
};

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
  const { darkMode, toggleDarkMode, language, setLanguage, cartCount, user, logout } = useStore();
  const count = cartCount();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        const cats = [...new Set(data.products.map((p: any) => p.category))].sort() as string[];
        setCategories(cats);
      });
  }, []);

  useEffect(() => {
    if (catModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [catModalOpen]);

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'} border-b backdrop-blur-md transition-all duration-300`}>
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div className="hidden sm:block">
            <div className={`font-bold text-base leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Simba</div>
            <div className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter leading-tight">Supermarket</div>
          </div>
        </Link>

        {/* Categories Trigger */}
        <button
          onClick={() => setCatModalOpen(true)}
          className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
            darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Categories
        </button>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search everything..."
              className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm outline-none transition-all ${
                darkMode
                  ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-600 focus:border-orange-500/50 focus:bg-gray-950'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500/30 focus:bg-white focus:shadow-sm'
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* Language */}
          <div className="hidden lg:flex items-center border dark:border-gray-800 rounded-lg p-0.5">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all ${
                  language === l.code
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-yellow-400 hover:bg-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block" />

          {/* User */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all"
              >
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold">{user.name[0].toUpperCase()}</span>
                </div>
                <span className="text-xs font-bold hidden sm:block dark:text-gray-200">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <Link href="/login" className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                <User className="w-4 h-4" />
                <span className="hidden sm:block uppercase tracking-wider">Sign in</span>
              </Link>
            )}

            {userMenuOpen && user && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className={`absolute right-0 top-12 z-50 w-48 rounded-xl shadow-xl border p-1 animate-slide-up ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                  <div className="px-3 py-2 mb-1 border-b dark:border-gray-800">
                    <p className="text-xs font-bold dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  {user.isAdmin && (
                    <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                      <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        ADMIN PANEL
                      </button>
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    SIGN OUT
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Cart */}
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-xl bg-gray-900 dark:bg-orange-500 text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-950/10 dark:shadow-orange-500/20"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 dark:bg-white text-white dark:text-orange-600 rounded-full text-[9px] flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className={`md:hidden px-4 pb-4 animate-slide-up ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none ${
                darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-950/30 backdrop-blur-sm animate-fade-in" 
            onClick={() => setCatModalOpen(false)} 
          />
          
          <div className={`relative w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl border animate-slide-up flex flex-col ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
          }`}>
            {/* Modal Header */}
            <div className={`px-8 py-6 flex items-center justify-between border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <div>
                <h2 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Shop by Category</h2>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Find exactly what you need from our sorted collections.</p>
              </div>
              <button 
                onClick={() => setCatModalOpen(false)}
                className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-50 text-gray-400'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat, i) => {
                  const meta = CATEGORY_META[cat] || { emoji: '🛒', color: 'from-gray-50 to-slate-50 text-slate-600', desc: 'Browse our collection' };
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setCatModalOpen(false);
                      }}
                      className={`group p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
                        darkMode ? 'bg-gray-800/20 border-gray-800 hover:border-orange-500/50 hover:bg-gray-800/40' : 'bg-gray-50 border-gray-100 hover:border-orange-500/30 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-2xl shrink-0 shadow-sm transition-transform group-hover:scale-110`}>
                        {meta.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm mb-0.5 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{cat}</h3>
                        <p className="text-[10px] text-gray-500 line-clamp-1">{meta.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-8 py-4 bg-gray-50 dark:bg-gray-800/30 flex items-center justify-between`}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Simba Supermarket · Rwanda
              </p>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-bold text-gray-400">Trusted by 10k+ customers</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${darkMode ? '#374151' : '#E5E7EB'}; 
          border-radius: 10px; 
        }
      `}</style>
    </nav>
  );
}
