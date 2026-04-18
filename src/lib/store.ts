import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Language } from './types';

interface User {
  name: string;
  email: string;
}

interface AppState {
  cart: CartItem[];
  language: Language;
  darkMode: boolean;
  user: User | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  cartCount: () => number;
  cartTotal: () => number;
  login: (user: User) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      language: 'en',
      darkMode: false,
      user: null,

      addToCart: (product) => {
        const cart = get().cart;
        const existing = cart.find((item) => item.product.id === product.id);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
      setLanguage: (lang) => set({ language: lang }),
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: () =>
        get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'simba-store' }
  )
);
