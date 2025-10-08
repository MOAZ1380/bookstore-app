export type Page =
  | 'home'
  | 'categories'
  | 'book-details'
  | 'cart'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'otp'
  | 'reset-password'
  | 'my-orders'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-categories'
  | 'admin-books'
  | 'admin-orders'
  | 'admin-users';

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  isNew: boolean;
  isBestseller: boolean;
}

export interface Category {
  id: number;
  name: string;
  count: number;
  icon: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  statusColor: string;
  books: string[];
}

export interface AdminStat {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}