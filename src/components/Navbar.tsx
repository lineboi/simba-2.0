'use client';

import { 
  ShoppingCart, 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  LayoutGrid,
  Search as SearchIcon,
  ChevronDown,
  Globe
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
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'rw', label: 'Kinyarwanda' },
] as const;

export default function Navbar({ onCartOpen, searchQuery, onSearchChange }: NavbarProps) {
  const { darkMode, toggleDarkMode, language, setLanguage, user, logout, cartCount } = useStore();
  const T = (key: string) => t(language, key);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const count = cartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-700 ${
      scrolled 
        ? 'py-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-lg shadow-black/5' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-6 md:gap-10">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.1 }}
              className="w-11 h-11 bg-slate-950 dark:bg-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-600/10 transition-all"
            >
              <span className="text-white font-black text-2xl tracking-tighter">S</span>
            </motion.div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full border-[3px] border-white dark:border-slate-950" 
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black tracking-tighter leading-none dark:text-white uppercase italic">SIMBA</h1>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mt-1 opacity-80">2.0 Digital</p>
          </div>
        </Link>

        {/* SEARCH - DESKTOP */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <div className={`group flex items-center gap-4 px-6 py-3 rounded-[2.5rem] border transition-all duration-500 ${
            darkMode 
              ? 'bg-slate-900/40 border-slate-800/50 focus-within:bg-slate-900 focus-within:border-orange-600 focus-within:ring-4 focus-within:ring-orange-600/10' 
              : 'bg-slate-100/50 border-slate-200/50 focus-within:bg-white focus-within:border-orange-500 focus-within:shadow-2xl focus-within:ring-4 focus-within:ring-orange-500/10'
          }`}>
            <SearchIcon className="w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" strokeWidth={3} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={T('search')}
              className="flex-1 bg-transparent border-none outline-none text-sm font-bold py-1.5 placeholder-slate-400 dark:placeholder-slate-500"
            />
            <div className="flex items-center gap-2">
              <kbd className="hidden lg:flex px-2.5 py-1 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-500">
                /
              </kbd>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Language Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all text-xs font-black uppercase tracking-widest ${
                darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              {language}
              <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-full mt-3 w-48 rounded-[2rem] border p-2 z-20 shadow-2xl ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                    }`}
                  >
                    {LANGS.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLanguage(l.code); setLangMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          language === l.code 
                            ? 'bg-orange-500 text-white' 
                            : darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {l.label}
                        {language === l.code && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User & Settings */}
          <div className="flex items-center bg-slate-200/30 dark:bg-slate-800/30 p-1.5 rounded-[2rem]">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleDarkMode()}
              className={`p-2.5 rounded-full transition-all ${
                darkMode 
                  ? 'bg-slate-800 text-amber-400' 
                  : 'bg-white text-slate-400 shadow-sm'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4 fill-current" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2" />

            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pr-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                    {user.name[0].toUpperCase()}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link href="/login" className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 text-orange-500" />
                  {T('signIn')}
                </Link>
              )}

              <AnimatePresence>
                {userMenuOpen && user && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 top-full mt-4 w-64 rounded-[2.5rem] shadow-2xl border p-3 z-20 ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className="px-5 py-5 mb-2 bg-slate-50 dark:bg-slate-950/40 rounded-[2rem]">
                        <p className="text-xs font-black uppercase tracking-tight truncate">{user.name}</p>
                        <p className="text-[9px] text-slate-500 font-bold tracking-widest mt-0.5 truncate">{user.email}</p>
                        <div className="mt-3">
                          <span className="text-[8px] font-black px-3 py-1 rounded-full bg-orange-600 text-white uppercase tracking-widest">
                            {user.role}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 mt-2">
                        {(user.role === 'ADMIN' || user.role === 'BRANCH_MANAGER' || user.role === 'BRANCH_STAFF') && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                            <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-600/10 transition-colors uppercase tracking-widest text-left">
                              <LayoutGrid className="w-4 h-4" />
                              {T('managementPanel')}
                            </button>
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[10px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors uppercase tracking-widest text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          {T('signOut')}
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Admin Shortcut */}
          {user && (user.role === 'ADMIN' || user.role === 'BRANCH_MANAGER' || user.role === 'BRANCH_STAFF') && (
            <Link href="/admin">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                  darkMode
                    ? 'bg-slate-900 border-slate-700 text-orange-400 hover:bg-orange-600/10 hover:border-orange-500'
                    : 'bg-white border-slate-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 shadow-sm'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Admin
              </motion.div>
            </Link>
          )}

          {/* Cart Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCartOpen}
            className="relative w-12 h-12 rounded-2xl bg-orange-600 text-white shadow-xl shadow-orange-600/20 flex items-center justify-center group"
          >
            <ShoppingCart className="w-5 h-5 relative z-10" strokeWidth={2.5} />
            {count > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-slate-950 text-white rounded-full text-[10px] flex items-center justify-center font-black border-[3px] border-white dark:border-slate-900"
              >
                {count}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
