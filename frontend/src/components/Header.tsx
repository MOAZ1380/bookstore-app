import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, Book } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Avatar, AvatarFallback } from './ui/Avatar';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  cartItems: any[];
  isLoggedIn: boolean;
}

export const Header = ({ currentPage, navigateTo, cartItems, isLoggedIn }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-2 sm:space-x-4 space-x-reverse">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Book className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:block">عالم الكتب استور</h1>
          </div>

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

          <div className="hidden lg:flex items-center flex-1 max-w-sm xl:max-w-md mx-4 xl:mx-8">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="ابحث عن كتاب..." className="pr-10 text-right" dir="rtl" />
            </div>
          </div>

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

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

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
};