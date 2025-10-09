export type Page =
  | 'home'
  | 'categories'
  | 'book-details'
  | 'wishlist'
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
  description: string;
  price: number;
  discount: number;
  category: {
    id: number;
    name: string;
    description: string;
  };
  coverImage: string;
  stock: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
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