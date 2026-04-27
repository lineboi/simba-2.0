'use client';

import { 
  ShoppingCart, 
  Moon, 
  Sun, 
  X, 
  User, 
  LogOut, 
  LayoutGrid,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Zap,
  Loader2
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface NavbarProps {
  onCartOpen: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

interface AiSearchResponse {
  response: string;
  products: Product[];
}

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'rw', label: 'RW' },
] as const;

export default function Navbar({ onCartOpen }: NavbarProps) {
  const { darkMode, toggleDarkMode, language, setLanguage, user, logout, cartCount, addToCart } = useStore();
  const T = (key: string) => t(language, key);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aiSearchOpen, setAiSearchOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<AiSearchResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const count = cartCount();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiQuery.trim()) return;

    setLoadingAi(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery }),
      });
      const data = await res.json();
      setAiResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

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
              <h1 className="text-xl font-black tracking-tighter leading-none dark:text-white uppercase">SIMBA</h1>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] mt-0.5">2.0 Online</p>
            </div>
          </Link>

          {/* AI SEARCH BAR (CENTER) - DESKTOP */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <button
              onClick={() => {
                setAiSearchOpen(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className={`w-full group flex items-center gap-4 px-6 py-4 rounded-[2rem] border transition-all text-left ${
                darkMode 
                  ? 'bg-slate-900/50 border-slate-800 hover:border-orange-500/50' 
                  : 'bg-slate-50 border-slate-100 hover:border-orange-200 hover:bg-white hover:shadow-xl'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Sparkles className="w-4 h-4 text-white fill-current animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest text-orange-600">{T('aiAssistant')}</p>
                <p className="text-[11px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors">&quot;Do you have fresh milk?&quot; or &quot;I need something for breakfast&quot;</p>
              </div>
              <kbd className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-400">
                {T('aiAsk')}
              </kbd>
            </button>
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

            {/* Language */}
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

            {/* User */}
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
                  {T('signIn')}
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
                        <div className="mt-1">
                          <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 uppercase tracking-widest">{user.role}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {(user.role === 'ADMIN' || user.role === 'BRANCH_MANAGER' || user.role === 'BRANCH_STAFF') && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)}>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors uppercase tracking-widest text-left">
                              <LayoutGrid className="w-4 h-4" />
                              {T('managementPanel')}
                            </button>
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors uppercase tracking-widest text-left"
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

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartOpen}
              className="relative p-4 rounded-2xl bg-orange-600 text-white shadow-xl shadow-orange-600/20 group overflow-hidden"
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
          </div>
        </div>
      </nav>

      {/* AI CONVERSATIONAL SEARCH MODAL */}
      <AnimatePresence>
        {aiSearchOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiSearchOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-2xl rounded-[3rem] shadow-2xl border flex flex-col overflow-hidden max-h-[80vh] ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
              }`}
            >
              {/* Header */}
              <div className="p-8 pb-4 flex items-center justify-between border-b dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/20">
                    <Sparkles className="w-6 h-6 text-white fill-current animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tighter">{T('aiAssistant')}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{T('aiSubtitle')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAiSearchOpen(false)}
                  className={`p-3 rounded-2xl ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                {!aiResponse && !loadingAi && (
                  <div className="py-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/5 rounded-[2.5rem] flex items-center justify-center mx-auto">
                      <MessageSquare className="w-10 h-10 text-orange-200 dark:text-orange-900" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-lg">{T('aiHelpTitle')}</p>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto">{T('aiHelpSub')}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Do you have milk?', 'I need breakfast items', 'Organic vegetables', 'Cleaning supplies'].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => { setAiQuery(suggestion); handleAiSearch(); }}
                          className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            darkMode ? 'border-slate-800 hover:border-orange-500/50 bg-slate-900' : 'border-slate-100 hover:border-orange-200 bg-white shadow-sm'
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loadingAi && (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 animate-pulse">{T('aiConsulting')}</p>
                  </div>
                )}

                {aiResponse && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* AI Message */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-orange-500 fill-current" />
                      </div>
                      <div className={`p-5 rounded-[2rem] rounded-tl-none text-sm font-medium leading-relaxed ${
                        darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-700'
                      }`}>
                        {aiResponse.response}
                      </div>
                    </div>

                    {/* Matched Products */}
                    {aiResponse.products && aiResponse.products.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-12">{T('aiFoundProducts')}</p>
                        <div className="grid grid-cols-2 gap-4 pl-12">
                          {aiResponse.products.map((p: Product) => (
                            <div key={p.id} className={`group p-4 rounded-3xl border transition-all ${
                              darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-orange-500/30' : 'bg-white border-slate-100 hover:shadow-xl'
                            }`}>
                              <div className="relative aspect-square mb-3 rounded-2xl overflow-hidden bg-white p-2 border border-slate-100 dark:border-transparent">
                                <Image src={p.image} alt={p.name} fill className="object-contain" unoptimized />
                              </div>
                              <p className="text-xs font-black tracking-tight line-clamp-1 mb-1">{p.name}</p>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-black text-orange-600">{p.price.toLocaleString()} RWF</span>
                                <button 
                                  onClick={() => addToCart(p)}
                                  className="w-8 h-8 rounded-full bg-slate-950 dark:bg-orange-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                                >
                                  <ShoppingCart className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-8 border-t dark:border-slate-800">
                <form onSubmit={handleAiSearch} className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={T('aiPlaceholder')}
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className={`w-full pl-6 pr-20 py-5 rounded-3xl border-2 outline-none transition-all ${
                      darkMode ? 'bg-slate-800 border-slate-700 focus:border-orange-500 text-white' : 'bg-slate-50 border-slate-100 focus:border-orange-500 text-slate-900'
                    }`}
                  />
                  <button
                    disabled={loadingAi || !aiQuery.trim()}
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
