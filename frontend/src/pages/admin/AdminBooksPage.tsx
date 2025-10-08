import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Edit, Trash2, Plus } from 'lucide-react';
import { sampleBooks } from '../../data/mockData';
import { Page } from '../../types';

interface AdminBooksPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminBooksPage = ({ currentPage, navigateTo, setIsAdmin }: AdminBooksPageProps) => (
  <div className="min-h-screen bg-gray-50" dir="rtl">
    <AdminHeader currentPage={currentPage} navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
    <div className="flex">
      <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إدارة الكتب</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 ml-2" />
            إضافة كتاب جديد
          </Button>
        </div>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الصورة</TableHead>
                  <TableHead className="text-right">العنوان</TableHead>
                  <TableHead className="text-right">المؤلف</TableHead>
                  <TableHead className="text-right">السعر</TableHead>
                  <TableHead className="text-right">التصنيف</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
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
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.price} ر.س</TableCell>
                    <TableCell>{book.category}</TableCell>
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