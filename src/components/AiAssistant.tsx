'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  Zap,
  ShoppingCart,
  User as UserIcon,
  Trash2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  products?: Product[];
}

export default function AiAssistant() {
  const { darkMode, language, addToCart, setAiFilteredProductIds } = useStore();
  const T = (key: string) => t(language, key);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, loading, isOpen]);

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = customQuery || query;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: q
    };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.response,
        products: data.products
      };
      setMessages(prev => [...prev, aiMsg]);

      if (data.products && data.products.length > 0) {
        setAiFilteredProductIds(data.products.map((p: Product) => p.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const clearChat = () => {
    setMessages([]);
    setAiFilteredProductIds(null);
  };

  return (
    <>
      {/* FAB TRIGGER - Positioned higher on mobile to avoid BottomNav */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-32 lg:bottom-6 right-6 z-[110] w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center transition-all bg-slate-950 dark:bg-orange-600 text-white shadow-orange-600/20 ${isOpen ? 'scale-0 opacity-0' : ''}`}
      >
        <Sparkles className="w-8 h-8 fill-current animate-pulse text-orange-500 dark:text-white" />
        <div className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
        </div>
      </motion.button>

      {/* SIDE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[120]"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed right-0 top-0 bottom-0 z-[130] w-full max-w-lg shadow-2xl border-l flex flex-col overflow-hidden ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
              }`}
            >
              {/* Header */}
              <div className="p-8 flex items-center justify-between border-b dark:border-slate-800 bg-slate-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
                    <Sparkles className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tighter uppercase leading-none">Simba Expert</h2>
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mt-2">Personal Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                   <button 
                    onClick={clearChat}
                    className="p-3 rounded-2xl hover:bg-white/10 transition-colors text-slate-400"
                    title="Reset Search"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide bg-slate-50/50 dark:bg-slate-950/20">
                {messages.length === 0 && !loading && (
                  <div className="py-20 text-center space-y-8 px-6">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-3">
                        <Zap className="w-12 h-12 text-white fill-current" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-900">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="font-black text-2xl tracking-tighter uppercase">{T('aiHelpTitle')}</p>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[240px] mx-auto">
                        {T('aiHelpSub')}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-2 pt-4">
                      {['Amata arahari?', 'Organic vegetables', 'Cleaning supplies'].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => handleSearch(undefined, suggestion)}
                          className={`px-6 py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all text-center ${
                            darkMode ? 'border-slate-800 hover:border-orange-500/50 bg-slate-900 text-slate-400' : 'border-slate-100 hover:border-orange-500/30 bg-white shadow-sm text-slate-600'
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-4`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-9 h-9 rounded-2xl bg-slate-950 flex items-center justify-center shrink-0 mt-1 shadow-xl">
                          <Zap className="w-4 h-4 text-orange-500 fill-current" />
                        </div>
                      )}
                      
                      <div className="space-y-5 max-w-[85%]">
                        <div className={`p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-orange-600 text-white rounded-tr-none shadow-orange-600/20' 
                            : darkMode ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>

                        {msg.products && msg.products.length > 0 && (
                          <div className="grid grid-cols-1 gap-4 pt-2">
                            <div className="flex items-center gap-3 px-1">
                               <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] shrink-0">Updated Grid</p>
                               <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                            </div>
                            {msg.products.map((p) => (
                              <motion.div 
                                key={p.id} 
                                whileHover={{ scale: 1.02 }}
                                className={`group p-4 rounded-[2rem] border-2 transition-all ${
                                  darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-orange-500/30' : 'bg-white border-slate-100 hover:border-orange-500/30 shadow-sm'
                                }`}
                              >
                                <div className="flex gap-4">
                                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white p-2 border border-slate-100 dark:border-transparent shrink-0">
                                    <Image src={p.image} alt={p.name} fill className="object-contain" unoptimized />
                                  </div>
                                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <p className="text-[11px] font-black tracking-tight line-clamp-1 uppercase leading-none">{p.name}</p>
                                    <p className="text-xs font-black text-orange-600 mt-2 tracking-tighter">{p.price.toLocaleString()} RWF</p>
                                  </div>
                                  <button 
                                    onClick={() => addToCart(p)}
                                    className="w-10 h-10 rounded-2xl bg-slate-950 dark:bg-orange-600 text-white flex items-center justify-center shrink-0 hover:scale-110 active:scale-95 transition-all shadow-lg"
                                  >
                                    <ShoppingCart className="w-4 h-4" strokeWidth={3} />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-9 h-9 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-orange-500/20">
                          <UserIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {loading && (
                    <div className="flex justify-start gap-4">
                      <div className="w-9 h-9 rounded-2xl bg-slate-950 flex items-center justify-center shrink-0">
                        <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                      </div>
                      <div className={`px-6 py-4 rounded-[2rem] rounded-tl-none ${darkMode ? 'bg-slate-800' : 'bg-white border border-slate-100'} shadow-sm`}>
                        <div className="flex gap-1.5">
                           <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                           <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                           <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-8 border-t dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask Simba Expert..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`w-full pl-6 pr-16 py-5 rounded-[2rem] border-2 outline-none transition-all text-sm font-black ${
                      darkMode ? 'bg-slate-800 border-slate-700 focus:border-orange-500 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-100 focus:border-orange-500 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button
                    disabled={loading || !query.trim()}
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3.5 bg-slate-950 dark:bg-orange-500 hover:scale-105 disabled:opacity-50 text-white rounded-2xl shadow-xl transition-all active:scale-95"
                  >
                    <Send className="w-5 h-5 text-orange-500 dark:text-white" strokeWidth={3} />
                  </button>
                </form>
                <div className="flex items-center justify-between mt-4 px-2">
                   <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    Expert AI Mode
                  </p>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    EN · FR · RW
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
