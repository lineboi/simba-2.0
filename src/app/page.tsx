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
import { ArrowUpDown } from 'lucide-react';

export default function Home() {
  const { darkMode, language } = useStore();
  const [data, setData] = useState<ProductsData | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/simba_products.json').then((r) => r.json()).then(setData);
  }, []);

  const categories = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.products.map((p) => p.category))].sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let products = data.products;
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

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const CATEGORY_EMOJI: Record<string, string> = {
    'Food Products': '🥬',
    'Cosmetics & Personal Care': '🧴',
    'Cleaning & Sanitary': '🧹',
    'Alcoholic Drinks': '🍺',
    'Baby Products': '👶',
    'Kitchenware & Electronics': '🍳',
    'Sports & Fitness': '💪',
    'Stationery': '📚',
    'General': '🛒',
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Hero onShopNow={scrollToProducts} />

        {/* Category grid cards */}
        <section className="mb-8">
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t(language, 'shopByCategory')}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); scrollToProducts(); }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition hover:scale-105 ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-md border border-gray-100'
                }`}
              >
                <span className="text-2xl">{CATEGORY_EMOJI[cat] || '🛒'}</span>
                <span className={`text-xs text-center font-medium leading-tight ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {cat.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Products section */}
        <div ref={productsRef}>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1 overflow-x-auto">
              <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={`text-sm px-3 py-2 rounded-xl border outline-none ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-700'
                }`}
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
            {filtered.length} {t(language, 'products')}
            {category && ` · ${category}`}
            {search && ` · "${search}"`}
          </p>

          {/* Grid */}
          {!data ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`rounded-2xl h-64 animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <p className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t(language, 'noProducts')}
              </p>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {t(language, 'tryDifferent')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
