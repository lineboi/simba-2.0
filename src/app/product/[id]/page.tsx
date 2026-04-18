'use client';

import { useEffect, useState, use } from 'react';
import { ProductsData, Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, ShoppingCart, Check, Package, Tag, Hash } from 'lucide-react';
import { getProductImage } from '@/lib/productImages';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    fetch('/simba_products.json')
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
      <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className={`w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar onCartOpen={() => setCartOpen(true)} searchQuery={search} onSearchChange={setSearch} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Link href="/" className={`inline-flex items-center gap-2 text-sm mb-6 hover:text-orange-500 transition ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <ArrowLeft className="w-4 h-4" />
          {t(language, 'backToProducts')}
        </Link>

        <div className={`rounded-3xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className={`relative h-72 md:h-auto min-h-80 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center justify-center p-8`}>
              <Image
                src={getProductImage(product.name, product.category)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full">
                    {t(language, 'outOfStock')}
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 flex flex-col">
              <span className={`text-sm font-medium text-orange-500 mb-2`}>{product.category}</span>
              <h1 className={`text-2xl md:text-3xl font-extrabold mb-4 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-extrabold text-orange-500">
                  {formatted(product.price)}
                </span>
                <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>RWF</span>
              </div>

              {/* Meta */}
              <div className={`grid grid-cols-2 gap-3 mb-8 p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{t(language, 'unit')}</p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{t(language, 'category')}</p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.category.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{t(language, 'sku')}</p>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>#{product.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${product.inStock ? 'bg-orange-500' : 'bg-red-500'}`}>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Status</p>
                    <p className={`text-sm font-semibold ${product.inStock ? 'text-orange-500' : 'text-red-500'}`}>
                      {product.inStock ? t(language, 'inStock') : t(language, 'outOfStock')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all ${
                    added
                      ? 'bg-orange-500 text-white'
                      : product.inStock
                      ? 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/30'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  {added ? t(language, 'addedToCart') : t(language, 'addToCart')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t(language, 'relatedProducts')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
