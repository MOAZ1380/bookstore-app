import { Book, Category, Order, AdminStat } from '../types';
import { Book as BookIcon, ShoppingBag, Users, BarChart3 } from 'lucide-react';

export const sampleBooks: Book[] = [
  {
    id: 3,
    title: 'تاريخ الحضارة العربية',
    author: 'محمد حسن',
    price: 90,
    originalPrice: 110,
    image: 'https://images.unsplash.com/photo-1709888246749-67223712d8bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBoaXN0b3J5JTIwY2xhc3NpY3xlbnwxfHx8fDE3NTk5MTM0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'تاريخية',
    rating: 4.3,
    description: 'رحلة عبر تاريخ الحضارة العربية الإسلامية، من البدايات الأولى حتى العصر الحديث، مع التركيز على الإنجازات الثقافية والعلمية.',
    isNew: false,
    isBestseller: false,
  },
];

export const categories: Category[] = [
  { id: 1, name: 'روايات', count: 245, icon: '📚' },
  { id: 2, name: 'علمية', count: 156, icon: '🔬' },
  { id: 3, name: 'تاريخية', count: 198, icon: '🏛️' },
  { id: 4, name: 'تعليمية', count: 324, icon: '🎓' },
  { id: 5, name: 'دينية', count: 187, icon: '🕌' },
  { id: 6, name: 'طبخ', count: 89, icon: '👨‍🍳' },
];

export const sampleOrders: Order[] = [
  {
    id: '#ORD001',
    date: '2024-01-15',
    total: 195,
    status: 'تم التسليم',
    statusColor: 'bg-green-100 text-green-800',
    books: ['رواية عربية حديثة', 'العلوم الحديثة والتكنولوجيا'],
  },
  {
    id: '#ORD002',
    date: '2024-01-10',
    total: 90,
    status: 'قيد الشحن',
    statusColor: 'bg-blue-100 text-blue-800',
    books: ['تاريخ الحضارة العربية'],
  },
  {
    id: '#ORD003',
    date: '2024-01-05',
    total: 165,
    status: 'قيد المعالجة',
    statusColor: 'bg-yellow-100 text-yellow-800',
    books: ['كتاب الطبخ العربي', 'أساسيات البرمجة'],
  },
];

export const adminStats: AdminStat[] = [
  { title: 'إجمالي الكتب', value: '1,245', icon: BookIcon, color: 'text-blue-600' },
  { title: 'إجمالي الطلبات', value: '2,847', icon: ShoppingBag, color: 'text-green-600' },
  { title: 'إجمالي المستخدمين', value: '5,692', icon: Users, color: 'text-purple-600' },
  { title: 'المبيعات الشهرية', value: '125,000 ر.س', icon: BarChart3, color: 'text-orange-600' },
];