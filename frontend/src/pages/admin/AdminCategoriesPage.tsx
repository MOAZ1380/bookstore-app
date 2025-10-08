import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { categories } from '../../data/mockData';
import { Page } from '../../types';

interface AdminCategoriesPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminCategoriesPage = ({ currentPage, navigateTo, setIsAdmin }: AdminCategoriesPageProps) => (
  <div className="min-h-screen bg-gray-50" dir="rtl">
    <AdminHeader currentPage={currentPage} navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
    <div className="flex">
      <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إدارة التصنيفات</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 ml-2" />
            إضافة تصنيف جديد
          </Button>
        </div>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الرمز</TableHead>
                  <TableHead className="text-right">اسم التصنيف</TableHead>
                  <TableHead className="text-right">عدد الكتب</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.icon}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.count}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
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