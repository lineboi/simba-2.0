'use client';

import { ShoppingCart, Check, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, darkMode, language } = useStore();
  const [added, setAdded] = useState(false);

  // Generate a stable random rating for demo purposes
  const rating = useMemo(() => {
    const hash = product.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 2) + 4; // 4 or 5 stars
  }, [product.name]);

  const reviewCount = useMemo(() => {
    const hash = product.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 50) + 5;
  }, [product.name]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formattedPrice = new Intl.NumberFormat('en-RW').format(product.price);

  return (
    <Link href={`/product/${product.id}`}>
      <div className={`group rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        {/* Image */}
        <div className="relative h-40 sm:h-44 bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg tracking-wider">
                {t(language, 'outOfStock')}
              </span>
            </div>
          )}
          {product.inStock && (
            <div className="absolute top-2 right-2">
              <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-tighter">
                {t(language, 'inStock')}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col h-[130px] sm:h-[140px]">
          <div className="flex items-center justify-between mb-1 gap-1">
            <p className={`text-[9px] font-bold uppercase tracking-widest truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {product.category.split(' ')[0]}
            </p>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className={`text-[10px] font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{rating}.0</span>
            </div>
          </div>
          <h3 className={`font-bold text-xs sm:text-sm leading-tight mb-2 line-clamp-2 h-8 sm:h-10 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-1">
            <div className="min-w-0">
              <span className="text-orange-600 font-black text-sm sm:text-base truncate block">{formattedPrice}</span>
              <span className={`text-[8px] font-bold uppercase tracking-tighter ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>RWF</span>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`shrink-0 w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-xl flex items-center justify-center transition-all ${
                added
                  ? 'bg-orange-500 text-white'
                  : product.inStock
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              {added ? (
                <Check className="w-4 h-4" />
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1 text-xs font-bold uppercase tracking-tighter">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
