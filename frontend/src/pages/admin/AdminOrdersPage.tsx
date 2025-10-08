import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Eye, Edit } from 'lucide-react';
import { sampleOrders } from '../../data/mockData';
import { Page } from '../../types';

interface AdminOrdersPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminOrdersPage = ({ currentPage, navigateTo, setIsAdmin }: AdminOrdersPageProps) => (
  <div className="min-h-screen bg-gray-50" dir="rtl">
    <AdminHeader currentPage={currentPage} navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
    <div className="flex">
      <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">إدارة الطلبات</h1>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.total} ر.س</TableCell>
                    <TableCell>
                      <Badge className={order.statusColor}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 ml-2" />
                          عرض
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
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