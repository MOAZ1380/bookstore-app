import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Page } from '../../types';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../api/category';

interface AdminCategoriesPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

const initialForm = { name: '', description: '' };

export const AdminCategoriesPage: React.FC<AdminCategoriesPageProps> = ({ currentPage, navigateTo, setIsAdmin }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ ...initialForm });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const res = await getAllCategories();
    if (res.success) setCategories(res.data);
    setLoading(false);
  };

  const openCreate = () => {
    setSelectedCategory(null);
    setFormData({ ...initialForm });
    setErrorMessage(null);
    setSuccessMessage(null);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setErrorMessage(null);
    setSuccessMessage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
    setFormData({ ...initialForm });
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('اسم التصنيف مطلوب');
      return;
    }

    try {
      setIsSaving(true);
      if (selectedCategory) {
        const res = await updateCategory(selectedCategory.id, formData);
        if (res.success) {
          setSuccessMessage('تم تحديث التصنيف');
          loadCategories();
          setTimeout(closeModal, 500);
        }
      } else {
        const res = await createCategory(formData);
        if (res.success) {
          setSuccessMessage('تم إنشاء التصنيف');
          loadCategories();
          setTimeout(closeModal, 500);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
  if (!window.confirm('هل أنت متأكد من حذف هذا التصنيف؟')) return;

  try {
    const res = await deleteCategory(id);
    if (res.success) {
      setSuccessMessage('تم حذف التصنيف بنجاح');
      loadCategories();
    } else {
      const msg = res.message || 'فشل حذف التصنيف';
      setErrorMessage(msg);
    }
  } catch (err: any) {
    console.error(err);
    const msg = err?.response?.data?.message || 'فشل حذف التصنيف';
    setErrorMessage(msg);
  }
};

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader currentPage={currentPage} navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
      <div className="flex">
        <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إدارة التصنيفات</h1>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={openCreate}>
              إضافة تصنيف جديد
            </Button>
          </div>

          {loading ? (
            <div className="text-center mt-10 text-gray-600">جارٍ تحميل التصنيفات...</div>
          ) : (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map(cat => (
                      <TableRow key={cat.id}>
                        <TableCell>{cat.name}</TableCell>
                        <TableCell>{cat.description || '-'}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>تعديل</Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600" onClick={() => handleDelete(cat.id)}>حذف</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed top-0 left-0 right-0 flex items-start justify-center bg-black bg-opacity-50 z-50 py-8 px-2 sm:px-4">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-xl sm:max-w-2xl overflow-y-auto max-h-[90vh] border border-gray-200">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">{selectedCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</h2>

            {errorMessage && <div className="text-sm text-red-700 bg-red-50 border border-red-100 p-2 rounded mb-2">{errorMessage}</div>}
            {successMessage && <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-2 rounded mb-2">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <Label>الاسم</Label>
                <Input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="flex flex-col gap-1">
                <Label>الوصف</Label>
                <Input name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={closeModal} disabled={isSaving}>إلغاء</Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isSaving}>
                  {isSaving ? 'جاري الحفظ...' : selectedCategory ? 'تحديث' : 'إنشاء'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
