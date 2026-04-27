export type UserRole = 'CUSTOMER' | 'BRANCH_MANAGER' | 'BRANCH_STAFF' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branchId?: string;
  noShowFlags?: number;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategoryId: number;
  image: string;
  unit: string;
  stock?: number; // Stock at selected branch
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

export interface Review {
  id: string;
  name: string;
  avatar: string;
  color: string;
  rating: number;
  text: string;
  location: string;
  verified: boolean;
  date: string;
  branchId?: string;
}

export type Language = 'en' | 'fr' | 'rw';

export interface Order {
  id: string;
  userId?: string;
  branchId: string;
  total: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  pickupTime?: string;
  depositPaid: boolean;
  depositAmount: number;
  assignedStaffId?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}
