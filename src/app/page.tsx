'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ProductsData } from '@/lib/types';
import { useStore } from '@/lib/store';
import { t, tCat } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import Ads from '@/components/Ads';
import Reviews from '@/components/Reviews';
import { 
  Search, 
  ArrowUpDown, 
  ChevronUp, 
  Star,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_SIZE = 12;

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  'Food Products': { emoji: '🥬', color: 'from-emerald-400 to-green-600' },
  'Cosmetics & Personal Care': { emoji: '🧴', color: 'from-pink-400 to-rose-600' },
  'Cleaning & Sanitary': { emoji: '🧹', color: 'from-blue-400 to-cyan-600' },
  'Alcoholic Drinks': { emoji: '🍺', color: 'from-amber-400 to-orange-600' },
  'Baby Products': { emoji: '👶', color: 'from-blue-500 to-indigo-600' },
  'Kitchenware & Electronics': { emoji: '🍳', color: 'from-slate-500 to-slate-700' },
  'Kitchen Storage': { emoji: '🫙', color: 'from-orange-400 to-amber-600' },
  'Sports & Fitness': { emoji: '💪', color: 'from-red-500 to-rose-700' },
  'Sports & Wellness': { emoji: '🏃', color: 'from-emerald-500 to-teal-700' },
  'Stationery': { emoji: '📚', color: 'from-purple-500 to-indigo-700' },
  'Pet Care': { emoji: '🐾', color: 'from-amber-600 to-orange-800' },
  'General': { emoji: '🛒', color: 'from-gray-400 to-slate-500' },
};

interface Category {
  name: string;
}

export default function Home() {
  const { darkMode, language } = useStore();
  const [data, setData] = useState<ProductsData | null>(null);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [catVisible, setCatVisible] = useState(false);
  const [showCatDrawer, setShowCatDrawer] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const productsRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/products').then((r) => r.json()).then(setData);
    fetch('/api/categories')
      .then(r => r.json())
      .then((catData: Category[]) => setCategories(catData.map((c) => c.name)));
  }, []);

  useEffect(() => {
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!catRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCatVisible(true); }, { threshold: 0.1 });
    obs.observe(catRef.current);
    return () => obs.disconnect();
  }, []);

  // Reset pagination when filter changes
  const [prevFilter, setPrevFilter] = useState({ category, search, sort });
  if (prevFilter.category !== category || prevFilter.search !== search || prevFilter.sort !== sort) {
    setPrevFilter({ category, search, sort });
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = useMemo(() => {
    let products = data?.products ?? [];
    if (category) products = products.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sort === 'price-asc') products = [...products].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') products = [...products].sort((a, b) => b.price - a.price);
    if (sort === 'name-az') products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    return products;
  }, [data, category, search, sort]);

  const visible = filtered.slice(0, visibleCount);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-12 md:space-y-16">
        
        {/* HERO SECTION */}
        <Hero
          onShopNow={scrollToProducts}
          categories={categories}
          onCategoryClick={(cat) => { setCategory(cat); scrollToProducts(); }}
        />

        {/* CATEGORIES SECTION */}
        <section id="categories" ref={catRef} className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-orange-600">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t(language, 'discovery')}</span>
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter">{t(language, 'shopByCategory')}</h2>
                {/* Mobile-only "View All" button */}
                <button
                  onClick={() => setShowCatDrawer(true)}
                  className="md:hidden text-orange-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-xl"
                >
                  {t(language, 'viewAll')}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            {/* Desktop "Explore" — now a real button that opens the drawer */}
            <button
              onClick={() => setShowCatDrawer(true)}
              className="hidden md:flex items-center gap-1.5 text-xs font-black text-orange-600 uppercase tracking-widest hover:underline underline-offset-4 transition-all"
            >
              {t(language, 'viewAllCategories')}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex lg:grid lg:grid-cols-12 gap-4 overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            {categories.map((cat, i) => {
              const meta = CATEGORY_META[cat] ?? { emoji: '🛒', color: 'from-gray-400 to-slate-500' };
              const isSelected = category === cat;
              return (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={catVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setCategory(cat); scrollToProducts(); }}
                  className={`group relative flex flex-col items-center gap-3 p-5 rounded-[2.5rem] transition-all duration-500 shrink-0 lg:shrink min-w-[110px] lg:min-w-0 border ${
                    isSelected
                      ? `bg-gradient-to-br ${meta.color} border-transparent shadow-2xl scale-105 z-10`
                      : darkMode 
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:border-transparent'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-2xl transition-all duration-500 shadow-inner ${
                    isSelected ? 'bg-white/20 rotate-6' : darkMode ? 'bg-slate-800 group-hover:rotate-6' : 'bg-white group-hover:rotate-6'
                  }`}>
                    {meta.emoji}
                  </div>
                  <span className={`text-[11px] text-center font-black uppercase tracking-wider leading-tight ${
                    isSelected ? 'text-white' : darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {tCat(language, cat).split(' ')[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* MIDDLE GRID: ADS + PRODUCTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" ref={productsRef}>
          
          {/* LEFT: REVIEWS (STICKY ON DESKTOP) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 order-2 lg:order-1">
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                  {t(language, 'community')}
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t(language, 'realVoices')}</p>
              </div>
              <Reviews />
            </div>
          </aside>

          {/* RIGHT: ADS + PRODUCTS */}
          <div className="lg:col-span-9 space-y-12 order-1 lg:order-2">
            
            <Ads />

            {/* PRODUCT LISTING CONTROLS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                 <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <ArrowUpDown className="w-4 h-4 text-orange-600" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer min-w-[100px]"
                  >
                    <option value="">{t(language, 'sortBy')}</option>
                    <option value="price-asc">{t(language, 'cheapest')}</option>
                    <option value="price-desc">{t(language, 'premium')}</option>
                    <option value="name-az">{t(language, 'azName')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="space-y-8">
              {filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="py-24 text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-[3rem] flex items-center justify-center mx-auto">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold">{t(language, 'noProducts')}</p>
                    <p className="text-slate-500 text-sm">{t(language, 'tryDifferent')}</p>
                  </div>
                  <button
                    onClick={() => { setCategory(''); setSearch(''); setSort(''); }}
                    className="text-orange-600 font-black uppercase text-xs tracking-[0.2em] hover:underline"
                  >
                    {t(language, 'clearFilters')}
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-8">
                  <AnimatePresence mode="popLayout">
                    {visible.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* PAGINATION */}
              {visibleCount < filtered.length && (
                <div className="flex justify-center pt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="shimmer-btn bg-slate-950 dark:bg-orange-600 text-white font-black uppercase tracking-[0.3em] text-[10px] px-12 py-5 rounded-[2rem] shadow-2xl"
                  >
                    {t(language, 'loadMore')}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE CATEGORY DRAWER */}
      <AnimatePresence>
        {showCatDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCatDrawer(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[120]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed inset-x-0 bottom-0 z-[130] rounded-t-[3rem] p-8 max-h-[85vh] overflow-y-auto ${
                darkMode ? 'bg-slate-900 border-t border-slate-800' : 'bg-white border-t border-slate-100'
              } shadow-[0_-20px_50px_rgba(0,0,0,0.1)]`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tighter">{t(language, 'exploreCategories2')}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t(language, 'whatLookingFor')}</p>
                </div>
                <button 
                  onClick={() => setShowCatDrawer(false)}
                  className={`p-3 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const meta = CATEGORY_META[cat] ?? { emoji: '🛒', color: 'from-gray-400 to-slate-500' };
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setShowCatDrawer(false); scrollToProducts(); }}
                      className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border transition-all ${
                        isSelected
                          ? `bg-gradient-to-br ${meta.color} border-transparent text-white shadow-xl`
                          : darkMode 
                            ? 'bg-slate-800 border-slate-700' 
                            : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <span className="text-3xl mb-1">{meta.emoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-center">{tCat(language, cat)}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />

      {/* FLOATING ACTION BUTTONS */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-28 lg:bottom-12 right-6 p-4 rounded-full shadow-2xl transition-all z-40 border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-orange-500' : 'bg-white border-slate-100 text-orange-600'
            }`}
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
