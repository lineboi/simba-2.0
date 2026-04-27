'use client';

import { ShoppingCart, Check, Star, Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, darkMode, language } = useStore();
  const T = (key: string) => t(language, key);
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Generate a stable random rating for demo purposes
  const rating = useMemo(() => {
    const hash = product.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 2) + 4; // 4 or 5 stars
  }, [product.name]);

  // Simplified stock check for demo (assume in stock if not defined)
  const isInStock = product.stock === undefined || product.stock > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isInStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formattedPrice = new Intl.NumberFormat('en-RW').format(product.price);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full"
    >
      <Link href={`/product/${product.id}`}>
        <div className={`relative group rounded-[2rem] overflow-hidden border transition-all duration-500 ${
          darkMode 
            ? 'bg-slate-900 border-slate-800 hover:border-orange-500/50 shadow-[0_0_20px_rgba(0,0,0,0.3)]' 
            : 'bg-white border-slate-100 hover:border-orange-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)]'
        }`}>
          {/* Top Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            {!isInStock && (
              <span className="bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                {T('soldOut')}
              </span>
            )}
            {isInStock && isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-green-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg"
              >
                {T('inStock')}
              </motion.span>
            )}
          </div>

          <button className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
            <Heart className="w-4 h-4" />
          </button>

          {/* Image Container */}
          <div className={`relative h-48 sm:h-56 overflow-hidden flex items-center justify-center p-6 ${
            darkMode ? 'bg-slate-800/50' : 'bg-slate-50/50'
          }`}>
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized
              />
            </motion.div>
            
            {/* Quick Add Overlay (Desktop) */}
            <AnimatePresence>
              {isHovered && isInStock && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute inset-0 bg-orange-500/10 backdrop-blur-[2px] hidden lg:flex items-center justify-center"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAdd}
                    className="bg-white text-orange-600 font-bold px-6 py-2.5 rounded-full shadow-xl flex items-center gap-2 hover:bg-orange-600 hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {T('addToCart')}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product Info */}
          <div className="p-5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                darkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {product.category.split(' ')[0]}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className={`text-[11px] font-black ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {rating}.0
                </span>
              </div>
            </div>

            <h3 className={`font-bold text-sm sm:text-base leading-tight line-clamp-2 h-10 sm:h-12 mt-1 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {product.name}
            </h3>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-orange-600 font-black text-lg sm:text-xl tracking-tighter">
                    {formattedPrice}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">RWF</span>
                </div>
                <span className="text-[9px] font-medium text-slate-400 italic">{T('perUnit')} {product.unit}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAdd}
                disabled={!isInStock}
                className={`relative overflow-hidden w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : isInStock
                    ? 'bg-orange-600 text-white shadow-[0_10px_20px_rgba(234,88,12,0.3)] hover:shadow-none'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800'
                }`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
