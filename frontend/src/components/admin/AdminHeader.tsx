import { useState } from 'react';
import { Settings, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Page } from '../../types';

interface AdminHeaderProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminHeader = ({ currentPage, navigateTo, setIsAdmin }: AdminHeaderProps) => {
  const [adminMobileMenuOpen, setAdminMobileMenuOpen] = useState(false);

  return (
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

            <button
              onClick={() => setAdminMobileMenuOpen(!adminMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {adminMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

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
};