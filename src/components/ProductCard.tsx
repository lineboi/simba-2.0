'use client';

import { ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { getProductImage } from '@/lib/productImages';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, darkMode, language } = useStore();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const formattedPrice = new Intl.NumberFormat('en-RW').format(product.price);
  const imgSrc = getProductImage(product.name, product.category);

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className={`group rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        {/* Image */}
        <div className="relative h-44 bg-gray-50 overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {t(language, 'outOfStock')}
              </span>
            </div>
          )}
          {product.inStock && (
            <div className="absolute top-2 right-2">
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {t(language, 'inStock')}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            {product.category}
          </p>
          <h3
            className={`font-medium text-sm leading-snug mb-2 line-clamp-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-orange-600 font-bold text-base">
                {formattedPrice}
              </span>
              <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                RWF
              </span>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                added
                  ? 'bg-orange-500 text-white'
                  : product.inStock
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3 h-3" />
                  {t(language, 'addedToCart')}
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3 h-3" />
                  {t(language, 'addToCart')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
