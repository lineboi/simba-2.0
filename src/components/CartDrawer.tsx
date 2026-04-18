'use client';

import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import { getProductImage } from '@/lib/productImages';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, darkMode, language, removeFromCart, updateQuantity, cartTotal } = useStore();
  const total = cartTotal();

  const formatted = (n: number) => new Intl.NumberFormat('en-RW').format(n);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        } ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t(language, 'cart')}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingBag className={`w-16 h-16 ${darkMode ? 'text-gray-700' : 'text-gray-200'}`} />
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t(language, 'cartEmpty')}
              </p>
              <button
                onClick={onClose}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-medium transition"
              >
                {t(language, 'continueShopping')}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className={`flex gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
              >
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-white">
                  <Image
                    src={getProductImage(item.product.name, item.product.category)}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.product.name}
                  </p>
                  <p className="text-orange-600 font-bold text-sm mt-1">
                    {formatted(item.product.price * item.quantity)} RWF
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className={`text-sm font-medium w-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto text-red-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} space-y-3`}>
            <div className="flex justify-between items-center">
              <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t(language, 'cartTotal')}
              </span>
              <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatted(total)} RWF
              </span>
            </div>
            <Link href="/checkout" onClick={onClose}>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition">
                {t(language, 'checkout')}
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
