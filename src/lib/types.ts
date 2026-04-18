export interface User {
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategoryId: number;
  inStock: boolean;
  image: string;
  unit: string;
}

export interface Store {
  name: string;
  tagline: string;
  location: string;
  currency: string;
}

export interface ProductsData {
  store: Store;
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Language = 'en' | 'fr' | 'rw';
