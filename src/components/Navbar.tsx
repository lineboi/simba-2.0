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
  ArrowRight,
  Menu
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onCartOpen: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'rw', label: 'RW' },
] as const;

export default function Navbar({ onCartOpen, searchQuery, onSearchChange }: NavbarProps) {
  const { darkMode, toggleDarkMode, language, setLanguage, user, logout, cartCount } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const count = cartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-[80] transition-all duration-500 ${
        scrolled 
          ? 'py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border-b border-slate-100 dark:border-slate-900' 
          : 'py-6 bg-transparent'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-8">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <motion.div 
                whileHover={{ rotate: 180 }}
                className="w-10 h-10 bg-slate-950 dark:bg-orange-600 rounded-2xl flex items-center justify-center shadow-2xl transition-transform"
              >
                <span className="text-white font-black text-xl">S</span>
              </motion.div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-slate-950" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter leading-none dark:text-white">SIMBA</h1>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] mt-0.5">Online</p>
            </div>
          </Link>

          {/* SEARCH BAR (CENTER) - DESKTOP */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
              <input
                type="text"
                placeholder={t(language, 'search')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full pl-12 pr-6 py-4 rounded-[2rem] text-sm font-medium outline-none transition-all border ${
                  darkMode 
                    ? 'bg-slate-900/50 border-slate-800 focus:bg-slate-900 focus:border-orange-500/50' 
                    : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-orange-200 shadow-inner'
                }`}
              />
              <kbd className="absolute right-5 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-400 hidden lg:block">
                /
              </kbd>
            </div>
          </div>

          {/* ACTIONS (RIGHT) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Dark Mode Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleDarkMode()}
              className={`p-3 rounded-2xl border transition-all ${
                darkMode 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:border-slate-700' 
                  : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:shadow-lg'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5 fill-current" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Language (Desktop) */}
            <div className="hidden lg:flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-1">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all ${
                    language === l.code 
                      ? 'bg-white dark:bg-slate-800 shadow-sm text-orange-600' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* User Account */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 pr-4 rounded-full border transition-all ${
                    darkMode 
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                      : 'bg-white border-slate-100 hover:shadow-lg'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <span className="text-white text-xs font-black">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="text-[11px] font-black hidden sm:block uppercase tracking-wider">{user.name.split(' ')[0]}</span>
                </button>
              ) : (
                <Link href="/login" className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:scale-105 active:scale-95 shadow-xl`}>
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              <AnimatePresence>
                {userMenuOpen && user && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[90]" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 top-14 z-[100] w-64 rounded-3xl shadow-2xl border p-2 ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="px-4 py-4 mb-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-black uppercase tracking-tight">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate">{user.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        {user.isAdmin && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors uppercase tracking-widest">
                              <LayoutGrid className="w-4 h-4" />
                              Admin Panel
                            </button>
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors uppercase tracking-widest"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartOpen}
              className="relative p-4 rounded-2xl bg-orange-600 text-white shadow-xl shadow-orange-600/20 hidden md:block group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <ShoppingCart className="w-5 h-5 relative z-10" />
              {count > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-slate-950 text-white rounded-full text-[10px] flex items-center justify-center font-black border-2 border-white dark:border-slate-950"
                >
                  {count}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Search Toggle */}
            <button 
              onClick={() => setMobileSearchOpen(true)}
              className="p-3 md:hidden rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors active:bg-orange-500 active:text-white"
            >
               <Search className="w-5 h-5 text-slate-400" />
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-0 z-[110] p-4 flex flex-col md:hidden ${
              darkMode ? 'bg-slate-950/95' : 'bg-white/95'
            } backdrop-blur-xl`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600" />
                <input
                  autoFocus
                  type="text"
                  placeholder={t(language, 'search')}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`w-full pl-11 pr-4 py-4 rounded-2xl text-sm font-bold outline-none border-2 transition-all ${
                    darkMode 
                      ? 'bg-slate-900 border-slate-800 focus:border-orange-500' 
                      : 'bg-slate-50 border-slate-100 focus:border-orange-500 shadow-inner'
                  }`}
                />
              </div>
              <button 
                onClick={() => {
                  setMobileSearchOpen(false);
                  onSearchChange('');
                }}
                className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
               <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {['Milk', 'Fruits', 'Drinks', 'Soap', 'Diapers'].map(tag => (
                        <button 
                          key={tag}
                          onClick={() => {
                            onSearchChange(tag);
                            setMobileSearchOpen(false);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border ${
                            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quick Links</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => {
                          setMobileSearchOpen(false);
                          const el = document.getElementById('categories');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border ${
                          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-bold">Categories</span>
                      </button>
                      <button 
                        onClick={() => {
                          setMobileSearchOpen(false);
                          onCartOpen();
                        }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border ${
                          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-bold">My Cart</span>
                      </button>
                    </div>
                  </div>
               </div>
            </div>

            <div className="py-8 text-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Simba Online Experience</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
