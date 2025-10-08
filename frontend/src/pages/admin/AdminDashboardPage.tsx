import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import { adminStats } from '../../data/mockData';
import { Page } from '../../types';

interface AdminDashboardPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminDashboardPage = ({ currentPage, navigateTo, setIsAdmin }: AdminDashboardPageProps) => (
  <div className="min-h-screen bg-gray-50" dir="rtl">
    <AdminHeader currentPage={currentPage} navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
    <div className="flex">
      <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">لوحة التحكم</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {adminStats.map((stat, index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="p-4 sm:p-6 flex items-center space-x-4 space-x-reverse">
                <div className={`p-3 rounded-full bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`}>
                  <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-base text-gray-600">{stat.title}</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);