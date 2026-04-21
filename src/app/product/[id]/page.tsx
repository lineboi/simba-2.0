'use client';

import { useEffect, useState, use } from 'react';
import { ProductsData, Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, ShoppingCart, Check, Package, Tag, Hash, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { darkMode, language, addToCart } = useStore();
  const [data, setData] = useState<ProductsData | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d: ProductsData) => {
        setData(d);
        const found = d.products.find((p) => p.id === Number(id));
        if (!found) { router.push('/'); return; }
        setProduct(found);
        setRelated(
          d.products.filter((p) => p.category === found.category && p.id !== found.id).slice(0, 5)
        );
      });
  }, [id, router]);

  const handleAdd = () => {
    if (!product || !product.inStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formatted = (n: number) => new Intl.NumberFormat('en-RW').format(n);

  if (!product) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
        <div className="max-w-7xl mx-auto px-4 py-32 flex items-center justify-center">
          <div className={`w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-32 lg:pb-12 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-6">
        {/* Breadcrumb */}
        <Link href="/" className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8 hover:text-orange-600 transition ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          <ArrowLeft className="w-4 h-4" />
          {t(language, 'backToProducts')}
        </Link>

        <div className={`rounded-[3rem] overflow-hidden border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-white shadow-xl'} shadow-2xl`}>
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className={`relative h-[400px] md:h-auto min-h-[400px] md:min-h-[600px] ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50/50'} flex items-center justify-center p-12 md:p-24`}>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full h-full"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </motion.div>
              {!product.inStock && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-red-500 text-white font-black uppercase tracking-widest px-8 py-3 rounded-full text-xs shadow-2xl">
                    {t(language, 'outOfStock')}
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-0.5 bg-orange-600" />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-orange-600`}>{product.category}</span>
              </div>
              
              <h1 className={`text-4xl md:text-5xl font-black mb-6 leading-[0.95] tracking-tighter ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-black text-orange-600 tracking-tighter">
                  {formatted(product.price)}
                </span>
                <span className={`text-lg font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>RWF</span>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <Package className="w-5 h-5 text-orange-600 mb-2" />
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t(language, 'unit')}</p>
                  <p className="text-sm font-black mt-0.5">{product.unit}</p>
                </div>
                <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <Tag className="w-5 h-5 text-orange-600 mb-2" />
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t(language, 'sku')}</p>
                  <p className="text-sm font-black mt-0.5">#{product.id}</p>
                </div>
              </div>

              {/* Desktop Add Button */}
              <div className="hidden lg:flex gap-4">
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl active:scale-95 ${
                    added
                      ? 'bg-green-500 text-white'
                      : product.inStock
                      ? 'bg-slate-950 dark:bg-orange-600 text-white hover:shadow-orange-500/30'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                  }`}
                >
                  {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  {added ? t(language, 'addedToCart') : t(language, 'addToCart')}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quality Assured</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Next Day Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-orange-600" />
              <h2 className={`text-2xl md:text-3xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {t(language, 'relatedProducts')}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* STICKY MOBILE ADD TO CART BAR */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 inset-x-0 z-[120] lg:hidden"
        >
          <div className={`p-4 pb-8 backdrop-blur-2xl border-t ${
            darkMode 
              ? 'bg-slate-950/90 border-slate-800 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]' 
              : 'bg-white/90 border-slate-100 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]'
          }`}>
            <div className="max-w-md mx-auto flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <p className={`text-[10px] font-black uppercase tracking-widest truncate max-w-[150px] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {product.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-orange-600">{formatted(product.price)}</span>
                  <span className="text-[9px] font-bold text-slate-400">RWF</span>
                </div>
              </div>
              
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-xl active:scale-95 ${
                  added
                    ? 'bg-green-500 text-white'
                    : product.inStock
                    ? 'bg-slate-950 dark:bg-orange-600 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                {added ? 'Added' : t(language, 'addToCart')}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
