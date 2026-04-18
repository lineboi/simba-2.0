'use client';

import { X, Minus, Plus, Trash2, ShoppingBag, ShoppingCart, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useStore } from '@/lib/store';
import { t } from '@/lib/translations';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, darkMode, language, removeFromCart, updateQuantity, cartTotal, clearCart } = useStore();
  const total = cartTotal();
  const router = useRouter();

  const formatted = (n: number) => new Intl.NumberFormat('en-RW').format(n);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Professional Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm animate-fade-in transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-xl max-h-[85vh] overflow-hidden rounded-2xl shadow-xl border animate-slide-up flex flex-col transition-all duration-300 ${
          darkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'
        }`}
      >
        {/* Refined Header */}
        <div className={`px-6 py-5 flex items-center justify-between border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <h2 className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t(language, 'cart')}
            </h2>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to clear your entire cart?')) {
                    clearCart();
                    onClose();
                    router.push('/');
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
            <button 
              onClick={onClose} 
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-50 text-gray-400'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <ShoppingBag className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              </div>
              <h3 className={`text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your cart is empty</h3>
              <p className={`text-sm mb-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Browse our products to add items here.
              </p>
              <button
                onClick={onClose}
                className="text-orange-500 font-bold text-sm hover:underline"
              >
                {t(language, 'continueShopping')}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {cart.map((item) => (
                <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4 group">
                  {/* Image */}
                  <div className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border p-2 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100 group-hover:bg-white group-hover:border-orange-100'}`}>
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-bold truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {item.product.name}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className={`text-gray-300 hover:text-red-500 transition-colors ml-2`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-[10px] font-medium text-gray-400 mb-3 uppercase tracking-wider">
                      {item.product.category}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border dark:border-gray-700 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className={`text-xs font-bold w-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {formatted(item.product.price * item.quantity)} RWF
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clean Summary Footer */}
        {cart.length > 0 && (
          <div className={`p-6 border-t ${darkMode ? 'bg-gray-800/30 border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatted(total)} RWF</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-4 border-b border-dashed dark:border-gray-700">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Delivery</span>
                <span className="text-green-500 font-bold uppercase text-[10px]">Free</span>
              </div>
              
              <div className="flex justify-between items-end pt-2">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Amount</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatted(total)} <span className="text-sm font-medium text-gray-500 uppercase">RWF</span>
                  </p>
                </div>
                
                <Link href="/checkout" onClick={onClose}>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2">
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 opacity-50">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Secure</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-50">
                  <Truck className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Express</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${darkMode ? '#374151' : '#E5E7EB'}; 
          border-radius: 10px; 
        }
      `}</style>
    </div>
  );
}
