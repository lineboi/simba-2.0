'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { ProductsData } from '@/lib/types';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import CategoryFilter from '@/components/CategoryFilter';
import Hero from '@/components/Hero';
import { ArrowUpDown, ChevronUp, Flame, Sparkles } from 'lucide-react';
import Reviews from '@/components/Reviews';

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  'Food Products':            { emoji: '🥬', color: 'from-green-400 to-emerald-500' },
  'Cosmetics & Personal Care':{ emoji: '🧴', color: 'from-pink-400 to-rose-500' },
  'Cleaning & Sanitary':      { emoji: '🧹', color: 'from-blue-400 to-cyan-500' },
  'Alcoholic Drinks':         { emoji: '🍺', color: 'from-amber-400 to-yellow-500' },
  'Baby Products':            { emoji: '👶', color: 'from-yellow-300 to-amber-400' },
  'Kitchenware & Electronics':{ emoji: '🍳', color: 'from-slate-400 to-gray-500' },
  'Kitchen Storage':          { emoji: '🫙', color: 'from-orange-300 to-amber-400' },
  'Sports & Fitness':         { emoji: '💪', color: 'from-red-400 to-orange-500' },
  'Sports & Wellness':        { emoji: '🏃', color: 'from-teal-400 to-cyan-500' },
  'Stationery':               { emoji: '📚', color: 'from-indigo-400 to-purple-500' },
  'Pet Care':                 { emoji: '🐾', color: 'from-orange-400 to-red-400' },
  'General':                  { emoji: '🛒', color: 'from-gray-400 to-slate-500' },
};

export default function Home() {
  const { darkMode, language } = useStore();
  const [data, setData] = useState<ProductsData | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [catVisible, setCatVisible] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/simba_products.json').then((r) => r.json()).then(setData);
  }, []);

  // Show scroll-to-top button
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Intersection observer for category section
  useEffect(() => {
    if (!catRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCatVisible(true); }, { threshold: 0.1 });
    obs.observe(catRef.current);
    return () => obs.disconnect();
  }, []);

  const categories = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.products.map((p) => p.category))].sort();
  }, [data]);

  const filtered = useMemo(() => {
    let products = data?.products ?? [];
    if (category) products = products.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sort === 'price-asc') products = [...products].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') products = [...products].sort((a, b) => b.price - a.price);
    else if (sort === 'name-az') products = [...products].sort((a, b) => a.name.localeCompare(b.name));
    return products;
  }, [data, category, search, sort]);

  // Featured = first 5 in-stock products
  const featured = useMemo(() => (data?.products ?? []).filter((p) => p.inStock).slice(0, 5), [data]);

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {/* HERO */}
        <Hero onShopNow={scrollToProducts} />

        {/* PROMO BANNER */}
        <div className={`relative overflow-hidden rounded-2xl p-5 flex items-center gap-4 ${darkMode ? 'bg-gradient-to-r from-orange-900/40 to-amber-900/20 border border-orange-800/30' : 'bg-gradient-to-r from-orange-500 to-amber-500'}`}>
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-24 h-24 rounded-full bg-white" style={{ left: `${i * 18}%`, top: '-20%', opacity: 0.3 }} />
            ))}
          </div>
          <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${darkMode ? 'bg-orange-500/20' : 'bg-white/20'}`}>
            🚀
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-white text-base">Free Delivery on All Orders in Kigali!</p>
            <p className="text-white/80 text-sm">Shop now and get your order within 24 hours</p>
          </div>
          <button
            onClick={scrollToProducts}
            className="shrink-0 bg-white text-orange-600 font-bold text-sm px-4 py-2 rounded-xl hover:scale-105 transition-transform shadow"
          >
            Shop Now
          </button>
        </div>

        {/* CATEGORIES */}
        <section ref={catRef}>
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h2 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t(language, 'shopByCategory')}
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-3">
            {categories.map((cat, i) => {
              const meta = CATEGORY_META[cat] ?? { emoji: '🛒', color: 'from-gray-400 to-slate-500' };
              return (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); scrollToProducts(); }}
                  className={`group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${
                    catVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  } ${category === cat
                    ? `bg-gradient-to-br ${meta.color} shadow-lg scale-105`
                    : darkMode ? 'bg-gray-800 hover:bg-gray-700 hover:scale-105' : 'bg-white hover:shadow-md hover:scale-105 border border-gray-100'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${
                    category === cat ? 'bg-white/20' : darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    {meta.emoji}
                  </div>
                  <span className={`text-xs text-center font-semibold leading-tight ${
                    category === cat ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {cat.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* FEATURED STRIP */}
        {!category && !search && featured.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t(language, 'featured')}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {featured.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-slide-up opacity-0"
                  style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'forwards' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ALL PRODUCTS */}
        <div ref={productsRef}>
          <div className="flex items-center gap-2 mb-5">
            <h2 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {category || t(language, 'allCategories')}
            </h2>
            {category && (
              <button
                onClick={() => setCategory('')}
                className="text-xs text-orange-500 hover:text-orange-600 font-medium px-2 py-0.5 rounded-lg border border-orange-200 hover:border-orange-400 transition"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={`text-sm px-3 py-2 rounded-xl border outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
              >
                <option value="">{t(language, 'sortBy')}</option>
                <option value="price-asc">{t(language, 'priceAsc')}</option>
                <option value="price-desc">{t(language, 'priceDesc')}</option>
                <option value="name-az">{t(language, 'nameAz')}</option>
              </select>
            </div>
          </div>

          {/* Count */}
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-bold text-orange-500">{filtered.length}</span>{' '}
            {t(language, 'products')}
            {category && ` in ${category}`}
            {search && ` matching "${search}"`}
          </p>

          {/* Grid */}
          {!data ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`rounded-2xl h-64 animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
                  style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <div className="text-6xl mb-4">🔍</div>
              <p className={`text-xl font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t(language, 'noProducts')}
              </p>
              <p className={`mb-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t(language, 'tryDifferent')}
              </p>
              <button
                onClick={() => { setSearch(''); setCategory(''); }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold transition"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-slide-up opacity-0"
                  style={{ animationDelay: `${Math.min(i, 20) * 0.04}s`, animationFillMode: 'forwards' }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <Reviews />
      </main>

      {/* Footer */}
      <footer className={`mt-20 border-t py-10 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div>
              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Simba Supermarket</div>
              <div className="text-xs text-orange-500">Rwanda&apos;s Online Supermarket</div>
            </div>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            © 2025 Simba Supermarket · Kigali, Rwanda
          </p>
        </div>
      </footer>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-11 h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}
