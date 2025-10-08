import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, Book, Users, FileText, Settings, BarChart3, Package, ShoppingBag, UserCheck, ArrowLeft, ArrowRight, Plus, Edit, Trash2, Eye, Star, Heart, Filter, MapPin, CreditCard, Check, Clock, Truck } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Separator } from './components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

type Page = 
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

// Mock data
const sampleBooks = [
  {
    id: 1,
    title: 'رواية عربية حديثة',
    author: 'أحمد محمد',
    price: 75,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1758796629109-4f38e9374f45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBub3ZlbCUyMGZpY3Rpb258ZW58MXx8fHwxNzU5ODc4NTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'روايات',
    rating: 4.5,
    description: 'رواية أدبية معاصرة تحكي قصة شاب يبحث عن معنى الحياة في عالم متغير. تجمع بين الواقعية والخيال لتقدم قراءة ممتعة ومثيرة للتفكير.',
    isNew: true,
    isBestseller: false
  },
  {
    id: 2,
    title: 'العلوم الحديثة والتكنولوجيا',
    author: 'د. سارة علي',
    price: 120,
    originalPrice: 150,
    image: 'https://images.unsplash.com/photo-1725870475677-7dc91efe9f93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBlZHVjYXRpb25hbCUyMHNjaWVuY2V8ZW58MXx8fHwxNzU5OTEzNDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'علمية',
    rating: 4.8,
    description: 'كتاب شامل يستكشف أحدث التطورات في العلوم والتكنولوجيا، مكتوب بأسلوب بسيط ومفهوم للقارئ العربي.',
    isNew: false,
    isBestseller: true
  },
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
    isBestseller: false
  }
];

const categories = [
  { id: 1, name: 'روايات', count: 245, icon: '📚' },
  { id: 2, name: 'علمية', count: 156, icon: '🔬' },
  { id: 3, name: 'تاريخية', count: 198, icon: '🏛️' },
  { id: 4, name: 'تعليمية', count: 324, icon: '🎓' },
  { id: 5, name: 'دينية', count: 187, icon: '🕌' },
  { id: 6, name: 'طبخ', count: 89, icon: '👨‍🍳' }
];

const sampleOrders = [
  {
    id: '#ORD001',
    date: '2024-01-15',
    total: 195,
    status: 'تم التسليم',
    statusColor: 'bg-green-100 text-green-800',
    books: ['رواية عربية حديثة', 'العلوم الحديثة والتكنولوجيا']
  },
  {
    id: '#ORD002',
    date: '2024-01-10',
    total: 90,
    status: 'قيد الشحن',
    statusColor: 'bg-blue-100 text-blue-800',
    books: ['تاريخ الحضارة العربية']
  },
  {
    id: '#ORD003',
    date: '2024-01-05',
    total: 165,
    status: 'قيد المعالجة',
    statusColor: 'bg-yellow-100 text-yellow-800',
    books: ['كتاب الطبخ العربي', 'أساسيات البرمجة']
  }
];

const adminStats = [
  { title: 'إجمالي الكتب', value: '1,245', icon: Book, color: 'text-blue-600' },
  { title: 'إجمالي الطلبات', value: '2,847', icon: ShoppingBag, color: 'text-green-600' },
  { title: 'إجمالي المستخدمين', value: '5,692', icon: Users, color: 'text-purple-600' },
  { title: 'المبيعات الشهرية', value: '125,000 ر.س', icon: BarChart3, color: 'text-orange-600' }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedBook, setSelectedBook] = useState(sampleBooks[0]);
  const [cartItems, setCartItems] = useState<typeof sampleBooks>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMobileMenuOpen, setAdminMobileMenuOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Navigation functions
  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const addToCart = (book: typeof sampleBooks[0]) => {
    setCartItems(prev => [...prev, book]);
  };

  const removeFromCart = (bookId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== bookId));
  };

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Book className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:block">عالم الكتب استور</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 space-x-reverse">
            <button 
              onClick={() => navigateTo('home')}
              className={`px-3 py-2 rounded-md transition-colors ${currentPage === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:text-purple-600'}`}
            >
              الرئيسية
            </button>
            <button 
              onClick={() => navigateTo('categories')}
              className={`px-3 py-2 rounded-md transition-colors ${currentPage === 'categories' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:text-purple-600'}`}
            >
              التصنيفات
            </button>
            <button className="px-3 py-2 rounded-md text-gray-700 hover:text-purple-600 transition-colors">
              تواصل معنا
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-sm xl:max-w-md mx-4 xl:mx-8">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="ابحث عن كتاب..."
                className="pr-10 text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
            <button 
              onClick={() => navigateTo('cart')}
              className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                <button 
                  onClick={() => navigateTo('my-orders')}
                  className="hidden sm:block text-gray-700 hover:text-purple-600 transition-colors"
                >
                  طلباتي
                </button>
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                  <AvatarFallback>م.ع</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <Button 
                onClick={() => navigateTo('login')}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-600 hover:bg-purple-50 hidden sm:flex"
              >
                تسجيل الدخول
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200" dir="rtl">
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="ابحث عن كتاب..." className="pr-10 text-right" dir="rtl" />
              </div>
              <button 
                onClick={() => navigateTo('home')}
                className={`text-right py-3 px-2 rounded transition-colors ${currentPage === 'home' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:text-purple-600'}`}
              >
                الرئيسية
              </button>
              <button 
                onClick={() => navigateTo('categories')}
                className={`text-right py-3 px-2 rounded transition-colors ${currentPage === 'categories' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:text-purple-600'}`}
              >
                التصنيفات
              </button>
              <button className="text-right py-3 px-2 rounded text-gray-700 hover:text-purple-600 transition-colors">
                تواصل معنا
              </button>
              {isLoggedIn ? (
                <button 
                  onClick={() => navigateTo('my-orders')}
                  className="text-right py-3 px-2 rounded text-gray-700 hover:text-purple-600 transition-colors"
                >
                  طلباتي
                </button>
              ) : (
                <Button 
                  onClick={() => navigateTo('login')}
                  className="bg-purple-600 hover:bg-purple-700 mt-2"
                >
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 text-white mt-8 sm:mt-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-3 sm:space-x-4 space-x-reverse mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Book className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold">عالم الكتب استور</h2>
            </div>
            <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
              أكبر متجر إلكتروني للكتب العربية. نوفر لك آلاف الكتب في جميع المجالات بأفضل الأسعار وأسرع خدمة توصيل.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 sm:mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">الرئيسية</button></li>
              <li><button onClick={() => navigateTo('categories')} className="hover:text-white transition-colors">التصنيفات</button></li>
              <li><button className="hover:text-white transition-colors">عن المكتبة</button></li>
              <li><button className="hover:text-white transition-colors">تواصل معنا</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 sm:mb-4">خدمة العملاء</h3>
            <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
              <li><button className="hover:text-white transition-colors">الأسئلة الشائعة</button></li>
              <li><button className="hover:text-white transition-colors">سياسة الإرجاع</button></li>
              <li><button className="hover:text-white transition-colors">طرق الدفع</button></li>
              <li><button className="hover:text-white transition-colors">الشحن والتوصيل</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2024 عالم الكتب استور. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );

  // Book Card Component
  const BookCard = ({ book, showAddToCart = true }: { book: typeof sampleBooks[0], showAddToCart?: boolean }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col" dir="rtl">
      <div onClick={() => { setSelectedBook(book); navigateTo('book-details'); }} className="flex-1">
        <div className="relative">
          <ImageWithFallback 
            src={book.image} 
            alt={book.title}
            className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-t-lg"
          />
          {book.isNew && <Badge className="absolute top-2 right-2 bg-green-600 text-xs">جديد</Badge>}
          {book.isBestseller && <Badge className="absolute top-2 left-2 bg-orange-600 text-xs">الأكثر مبيعاً</Badge>}
          <button className="absolute top-2 left-2 p-1.5 sm:p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>
        
        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="font-bold mb-1 text-right group-hover:text-purple-600 transition-colors text-sm sm:text-base line-clamp-2">{book.title}</h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 text-right">{book.author}</p>
          
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center space-x-1 space-x-reverse">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-xs sm:text-sm text-gray-600 mr-1">({book.rating})</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="text-right">
              <span className="text-base sm:text-lg font-bold text-purple-600">{book.price} ر.س</span>
              {book.originalPrice > book.price && (
                <span className="text-xs sm:text-sm text-gray-500 line-through mr-2 block sm:inline">{book.originalPrice} ر.س</span>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      
      {showAddToCart && (
        <div className="p-3 sm:p-4 pt-0">
          <Button 
            onClick={() => addToCart(book)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base py-2"
          >
            أضف إلى السلة
          </Button>
        </div>
      )}
    </Card>
  );

  // Page Components
  const HomePage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-l from-purple-600 to-blue-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="text-right order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                اكتشف عالم الكتب العربية
              </h1>
              <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-8 text-blue-100 leading-relaxed">
                آلاف الكتب في جميع المجالات بين يديك. اقرأ، تعلم، واستمتع بأفضل الكتب العربية والمترجمة
              </p>
              <Button 
                onClick={() => navigateTo('categories')}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto"
              >
                تصفح الكتب
              </Button>
            </div>
            <div className="lg:text-left order-1 lg:order-2">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1588618319344-424aa94f749e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmFiaWMlMjBib29rcyUyMGxpYnJhcnklMjBzaGVsZnxlbnwxfHx8fDE3NTk5MTM0Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="مكتبة الكتب"
                className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">تصفح حسب التصنيف</h2>
            <p className="text-gray-600 text-sm sm:text-base">اختر من بين مجموعة واسعة من التصنيفات</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className="text-center hover:shadow-md transition-all duration-300 cursor-pointer group"
                onClick={() => navigateTo('categories')}
              >
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">{category.icon}</div>
                  <h3 className="font-bold mb-1 sm:mb-2 group-hover:text-purple-600 transition-colors text-sm sm:text-base">{category.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{category.count} كتاب</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Books */}
      <div className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">الكتب المميزة</h2>
            <p className="text-gray-600 text-sm sm:text-base">أحدث الإصدارات والكتب الأكثر مبيعاً</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {sampleBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <Button 
              onClick={() => navigateTo('categories')}
              variant="outline"
              size="lg"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 w-full sm:w-auto"
            >
              عرض جميع الكتب
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );

  const CategoriesPage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">تصفح الكتب</h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 ml-2" />
                تصفية
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <span className="text-sm text-gray-600">ترتيب حسب:</span>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="الأحدث" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
                  <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[...sampleBooks, ...sampleBooks, ...sampleBooks].map((book, index) => (
            <BookCard key={`${book.id}-${index}`} book={{...book, id: book.id + index * 10}} />
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button variant="outline" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-purple-600 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );

  const BookDetailsPage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <div className="order-2 lg:order-1">
            <ImageWithFallback 
              src={selectedBook.image}
              alt={selectedBook.title}
              className="w-full max-w-sm sm:max-w-md mx-auto h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                {selectedBook.isNew && <Badge className="bg-green-600 text-xs sm:text-sm">جديد</Badge>}
                {selectedBook.isBestseller && <Badge className="bg-orange-600 text-xs sm:text-sm">الأكثر مبيعاً</Badge>}
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">{selectedBook.title}</h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4">بقلم: {selectedBook.author}</p>
              
              <div className="flex items-center space-x-4 space-x-reverse mb-4">
                <div className="flex items-center space-x-1 space-x-reverse">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(selectedBook.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm sm:text-base text-gray-600 mr-2">({selectedBook.rating}) • 156 تقييم</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-purple-600">{selectedBook.price} ر.س</span>
                <div className="flex items-center space-x-2 space-x-reverse">
                  {selectedBook.originalPrice > selectedBook.price && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">{selectedBook.originalPrice} ر.س</span>
                  )}
                  {selectedBook.originalPrice > selectedBook.price && (
                    <Badge variant="destructive" className="text-xs">
                      خصم {Math.round((1 - selectedBook.price / selectedBook.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold">وصف الكتاب</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{selectedBook.description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
              <div>
                <span className="font-bold">التصنيف:</span> {selectedBook.category}
              </div>
              <div>
                <span className="font-bold">اللغة:</span> العربية
              </div>
              <div>
                <span className="font-bold">الصفحات:</span> 285 صفحة
              </div>
              <div>
                <span className="font-bold">النشر:</span> 2024
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
              <Button 
                onClick={() => addToCart(selectedBook)}
                size="lg"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                أضف إلى السلة
              </Button>
              <Button variant="outline" size="lg" className="sm:w-auto">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
            
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center space-x-2 space-x-reverse text-blue-700">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-bold text-sm sm:text-base">شحن مجاني</span>
              </div>
              <p className="text-xs sm:text-sm text-blue-600 mt-1">توصيل مجاني للطلبات أكثر من 100 ر.س</p>
            </div>
          </div>
        </div>
        
        {/* Related Books */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">كتب ذات صلة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {sampleBooks.filter(book => book.id !== selectedBook.id).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );

  const CartPage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">سلة التسوق</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">سلة التسوق فارغة</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">لم تقم بإضافة أي كتب إلى السلة بعد</p>
            <Button 
              onClick={() => navigateTo('categories')}
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              تصفح الكتب
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>الكتب المحددة ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {cartItems.map((book, index) => (
                    <div key={`${book.id}-${index}`} className="flex items-center space-x-3 sm:space-x-4 space-x-reverse p-3 sm:p-4 border rounded-lg">
                      <ImageWithFallback 
                        src={book.image}
                        alt={book.title}
                        className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 text-right min-w-0">
                        <h3 className="font-bold text-sm sm:text-base line-clamp-2">{book.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{book.author}</p>
                        <p className="text-purple-600 font-bold text-sm sm:text-base">{book.price} ر.س</p>
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(book.id)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>المجموع الفرعي:</span>
                    <span>{cartItems.reduce((sum, book) => sum + book.price, 0)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>الشحن:</span>
                    <span className="text-green-600">مجاني</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>المجموع الكلي:</span>
                    <span className="text-purple-600">{cartItems.reduce((sum, book) => sum + book.price, 0)} ر.س</span>
                  </div>
                  
                  {!isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-yellow-800 text-xs sm:text-sm text-center">
                          يجب تسجيل الدخول لإتمام الطلب
                        </p>
                      </div>
                      <Button 
                        onClick={() => navigateTo('login')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        تسجيل الدخول
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      إتمام الطلب
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );

  const LoginPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <p className="text-gray-600">أدخل بياناتك للوصول إلى حسابك</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigateTo('forgot-password')}
                className="text-sm text-purple-600 hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <Button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              تسجيل الدخول
            </Button>
            <div className="text-center">
              <span className="text-gray-600">ليس لديك حساب؟ </span>
              <button 
                onClick={() => navigateTo('register')}
                className="text-purple-600 hover:underline"
              >
                إنشاء حساب جديد
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const RegisterPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
            <p className="text-gray-600">انضم إلى عالم الكتب استور اليوم</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input 
                id="name"
                placeholder="أدخل اسمك الكامل"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input 
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input 
                id="confirmPassword"
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                className="text-right"
                dir="rtl"
              />
            </div>
            <Button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              إنشاء الحساب
            </Button>
            <div className="text-center">
              <span className="text-gray-600">لديك حساب بالفعل؟ </span>
              <button 
                onClick={() => navigateTo('login')}
                className="text-purple-600 hover:underline"
              >
                تسجيل الدخول
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ForgotPasswordPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">نسيت كلمة المرور؟</CardTitle>
            <p className="text-gray-600">أدخل بريدك الإلكتروني لإرسال رمز التحقق</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input 
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="text-right"
                dir="rtl"
              />
            </div>
            <Button 
              onClick={() => navigateTo('otp')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              إرسال رمز التحقق
            </Button>
            <div className="text-center">
              <button 
                onClick={() => navigateTo('login')}
                className="text-purple-600 hover:underline"
              >
                العودة إلى تسجيل الدخول
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const OTPPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">رمز التحقق</CardTitle>
            <p className="text-gray-600">أدخل الرمز المرسل إلى بريدك الإلكتروني</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>رمز التحقق (6 أرقام)</Label>
              <div className="flex justify-center space-x-2 space-x-reverse">
                {[...Array(6)].map((_, i) => (
                  <Input 
                    key={i}
                    className="w-12 h-12 text-center text-lg"
                    maxLength={1}
                    onChange={(e) => {
                      const newOtp = otpCode.split('');
                      newOtp[i] = e.target.value;
                      setOtpCode(newOtp.join(''));
                    }}
                  />
                ))}
              </div>
            </div>
            <Button 
              onClick={() => navigateTo('reset-password')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              تأكيد الرمز
            </Button>
            <div className="text-center">
              <span className="text-gray-600">لم تتلقى الرمز؟ </span>
              <button className="text-purple-600 hover:underline">
                إعادة الإرسال
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ResetPasswordPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
            <p className="text-gray-600">أدخل كلمة المرور الجديدة</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
              <Input 
                id="newPassword"
                type="password"
                placeholder="أدخل كلمة المرور الجديدة"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">تأكيد كلمة المرور الجديدة</Label>
              <Input 
                id="confirmNewPassword"
                type="password"
                placeholder="أعد إدخال كلمة المرور الجديدة"
                className="text-right"
                dir="rtl"
              />
            </div>
            <Button 
              onClick={() => {
                setIsLoggedIn(true);
                navigateTo('home');
              }}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              حفظ كلمة المرور الجديدة
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const MyOrdersPage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">طلباتي</h1>
        
        <div className="space-y-4 sm:space-y-6">
          {sampleOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                    <h3 className="font-bold text-base sm:text-lg">طلب رقم {order.id}</h3>
                    <Badge className={`${order.statusColor} text-xs w-fit`}>{order.status}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm sm:text-base">تاريخ الطلب: {order.date}</p>
                    <p className="font-bold text-purple-600 text-sm sm:text-base">{order.total} ر.س</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-sm sm:text-base">الكتب:</h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base">
                    {order.books.map((book, index) => (
                      <li key={index}>{book}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-2 space-x-reverse text-xs sm:text-sm text-gray-600">
                    {order.status === 'تم التسليم' && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />}
                    {order.status === 'قيد الشحن' && <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />}
                    {order.status === 'قيد المعالجة' && <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />}
                    <span>حالة الطلب: {order.status}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                    عرض التفاصيل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {sampleOrders.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات</h2>
            <p className="text-gray-600 mb-8">لم تقم بأي طلبات بعد</p>
            <Button 
              onClick={() => navigateTo('categories')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              تصفح الكتب
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );

  // Admin Pages
  const AdminLoginPage = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">لوحة التحكم</CardTitle>
            <p className="text-gray-600">تسجيل دخول المدير</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminEmail">البريد الإلكتروني</Label>
              <Input 
                id="adminEmail"
                type="email"
                placeholder="أدخل بريد المدير"
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">كلمة المرور</Label>
              <Input 
                id="adminPassword"
                type="password"
                placeholder="أدخل كلمة مرور المدير"
                className="text-right"
                dir="rtl"
              />
            </div>
            <Button 
              onClick={() => {
                setIsAdmin(true);
                navigateTo('admin-dashboard');
              }}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              تسجيل الدخول
            </Button>
            <div className="text-center">
              <button 
                onClick={() => navigateTo('home')}
                className="text-purple-600 hover:underline text-sm"
              >
                العودة إلى الموقع الرئيسي
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AdminHeader = () => (
    <header className="bg-white shadow-sm border-b border-gray-200" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-3 sm:space-x-4 space-x-reverse">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-base sm:text-xl font-bold text-gray-900 hidden sm:block">لوحة التحكم - عالم الكتب استور</h1>
            <h1 className="text-base font-bold text-gray-900 sm:hidden">لوحة التحكم</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
            <Button 
              onClick={() => navigateTo('home')}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              عرض الموقع
            </Button>
            <Button 
              onClick={() => {
                setIsAdmin(false);
                navigateTo('admin-login');
              }}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              خروج
            </Button>
            
            {/* Mobile Menu Button for Admin */}
            <button 
              onClick={() => setAdminMobileMenuOpen(!adminMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {adminMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Admin Menu */}
        {adminMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200" dir="rtl">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => {
                  navigateTo('admin-dashboard');
                  setAdminMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                  currentPage === 'admin-dashboard' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5 ml-3" />
                الرئيسية
              </button>
              <button 
                onClick={() => {
                  navigateTo('admin-categories');
                  setAdminMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                  currentPage === 'admin-categories' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5 ml-3" />
                إدارة التصنيفات
              </button>
              <button 
                onClick={() => {
                  navigateTo('admin-books');
                  setAdminMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                  currentPage === 'admin-books' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Book className="w-5 h-5 ml-3" />
                إدارة الكتب
              </button>
              <button 
                onClick={() => {
                  navigateTo('admin-orders');
                  setAdminMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                  currentPage === 'admin-orders' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5 ml-3" />
                إدارة الطلبات
              </button>
              <button 
                onClick={() => {
                  navigateTo('admin-users');
                  setAdminMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                  currentPage === 'admin-users' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5 ml-3" />
                إدارة المستخدمين
              </button>
              <Button 
                onClick={() => navigateTo('home')}
                variant="outline"
                className="mt-4 mx-4"
              >
                عرض الموقع
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  const AdminSidebar = () => (
    <div className="w-64 bg-white shadow-lg h-full hidden lg:block" dir="rtl">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          <button 
            onClick={() => navigateTo('admin-dashboard')}
            className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'admin-dashboard' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5 ml-3" />
            الرئيسية
          </button>
          <button 
            onClick={() => navigateTo('admin-categories')}
            className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'admin-categories' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5 ml-3" />
            إدارة التصنيفات
          </button>
          <button 
            onClick={() => navigateTo('admin-books')}
            className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'admin-books' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Book className="w-5 h-5 ml-3" />
            إدارة الكتب
          </button>
          <button 
            onClick={() => navigateTo('admin-orders')}
            className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'admin-orders' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package className="w-5 h-5 ml-3" />
            إدارة الطلبات
          </button>
          <button 
            onClick={() => navigateTo('admin-users')}
            className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
              currentPage === 'admin-users' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5 ml-3" />
            إدارة المستخدمين
          </button>
        </div>
      </nav>
    </div>
  );

  const AdminDashboardPage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">نظرة عامة</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {adminStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">الطلبات الحديثة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {sampleOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                      <div className="text-right">
                        <p className="font-semibold text-sm sm:text-base">{order.id}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{order.date}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-purple-600 text-sm sm:text-base">{order.total} ر.س</p>
                        <Badge className={`${order.statusColor} text-xs`}>{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">الكتب الأكثر مبيعاً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {sampleBooks.map((book, index) => (
                    <div key={book.id} className="flex items-center space-x-3 sm:space-x-4 space-x-reverse">
                      <span className="text-sm sm:text-lg font-bold text-gray-400">#{index + 1}</span>
                      <ImageWithFallback 
                        src={book.image}
                        alt={book.title}
                        className="w-10 h-12 sm:w-12 sm:h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 text-right min-w-0">
                        <p className="font-semibold text-sm sm:text-base line-clamp-1">{book.title}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{book.author}</p>
                      </div>
                      <p className="font-bold text-purple-600 text-sm sm:text-base">{book.price} ر.س</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminCategoriesPage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">إدارة التصنيفات</h1>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة تصنيف
            </Button>
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs sm:text-sm">اسم التصنيف</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">عدد الكتب</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden sm:table-cell">الرمز</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden md:table-cell">تاريخ الإنشاء</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium text-right text-xs sm:text-sm">{category.name}</TableCell>
                        <TableCell className="text-right text-xs sm:text-sm">{category.count}</TableCell>
                        <TableCell className="text-right text-xs sm:text-sm hidden sm:table-cell">{category.icon}</TableCell>
                        <TableCell className="text-right text-xs sm:text-sm hidden md:table-cell">2024-01-01</TableCell>
                        <TableCell className="text-right">
                          <div className="flex space-x-1 sm:space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm" className="p-1 sm:p-2">
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 p-1 sm:p-2">
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const AdminBooksPage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">إدارة الكتب</h1>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 ml-2" />
              إضافة كتاب
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الصورة</TableHead>
                    <TableHead className="text-right">اسم الكتاب</TableHead>
                    <TableHead className="text-right">المؤلف</TableHead>
                    <TableHead className="text-right">التصنيف</TableHead>
                    <TableHead className="text-right">السعر</TableHead>
                    <TableHead className="text-right">التقييم</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <ImageWithFallback 
                          src={book.image}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-right">{book.title}</TableCell>
                      <TableCell className="text-right">{book.author}</TableCell>
                      <TableCell className="text-right">{book.category}</TableCell>
                      <TableCell className="text-right">{book.price} ر.س</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{book.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const AdminOrdersPage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">إدارة الطلبات</h1>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الطلب</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-right">{order.id}</TableCell>
                      <TableCell className="text-right">محمد أحمد</TableCell>
                      <TableCell className="text-right">{order.date}</TableCell>
                      <TableCell className="text-right">{order.total} ر.س</TableCell>
                      <TableCell className="text-right">
                        <Badge className={order.statusColor}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Select>
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue placeholder="تحديث الحالة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="processing">قيد المعالجة</SelectItem>
                              <SelectItem value="shipped">قيد الشحن</SelectItem>
                              <SelectItem value="delivered">تم التسليم</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const AdminUsersPage = () => (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">إدارة المستخدمين</h1>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right">عدد الطلبات</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1, name: 'محمد أحمد', email: 'mohammed@example.com', joinDate: '2024-01-15', orders: 5, status: 'نشط' },
                    { id: 2, name: 'سارة علي', email: 'sara@example.com', joinDate: '2024-01-10', orders: 3, status: 'نشط' },
                    { id: 3, name: 'أحمد محمد', email: 'ahmed@example.com', joinDate: '2024-01-05', orders: 8, status: 'نشط' }
                  ].map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-right">{user.name}</TableCell>
                      <TableCell className="text-right">{user.email}</TableCell>
                      <TableCell className="text-right">{user.joinDate}</TableCell>
                      <TableCell className="text-right">{user.orders}</TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Page Renderer
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'categories': return <CategoriesPage />;
      case 'book-details': return <BookDetailsPage />;
      case 'cart': return <CartPage />;
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;
      case 'forgot-password': return <ForgotPasswordPage />;
      case 'otp': return <OTPPage />;
      case 'reset-password': return <ResetPasswordPage />;
      case 'my-orders': return <MyOrdersPage />;
      case 'admin-login': return <AdminLoginPage />;
      case 'admin-dashboard': return <AdminDashboardPage />;
      case 'admin-categories': return <AdminCategoriesPage />;
      case 'admin-books': return <AdminBooksPage />;
      case 'admin-orders': return <AdminOrdersPage />;
      case 'admin-users': return <AdminUsersPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div style={{ fontFamily: 'Cairo, Tajawal, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      {renderPage()}
      
      {/* Admin Access Button - Fixed position */}
      {!isAdmin && (
        <button
          onClick={() => navigateTo('admin-login')}
          className="fixed bottom-4 left-4 bg-purple-600 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
          title="دخول المدير"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
}