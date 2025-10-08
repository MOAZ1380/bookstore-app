import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Edit, Trash2 } from 'lucide-react';
import { Page } from '../../types';

interface AdminUsersPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const sampleUsers = [
  { id: 1, name: 'محمد أحمد', email: 'mohammed@example.com', role: 'مستخدم' },
  { id: 2, name: 'سارة علي', email: 'sarah@example.com', role: 'إداري' },
  { id: 3, name: 'عبدالله خالد', email: 'abdullah@example.com', role: 'مستخدم' },
];

export const AdminUsersPage = ({ currentPage, navigateTo, setIsAdmin }: AdminUsersPageProps) => (
  <div className="min-h-screen bg-gray-50" dir="rtl">
    <AdminHeader currentPage={currentPage} navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
    <div className="flex">
      <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مستخدم جديد
          </Button>
        </div>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
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