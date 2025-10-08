import { BarChart3, FileText, Book, Package, Users } from 'lucide-react';
import { Page } from '../../types';

interface AdminSidebarProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

export const AdminSidebar = ({ currentPage, navigateTo }: AdminSidebarProps) => (
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