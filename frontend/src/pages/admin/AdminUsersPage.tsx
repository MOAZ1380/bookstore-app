import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Page } from '../../types';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../api/users';

interface AdminUsersPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

interface Address {
  country?: string;
  city?: string;
  street?: string;
  house_number?: string;
  floor?: string;
}

interface User {
  id: number;
  name: string | null;
  email: string;
  phone?: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  address?: Address | null;
}

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'USER',
  country: '',
  city: '',
  street: '',
  house_number: '',
  floor: '',
};

export const AdminUsersPage: React.FC<AdminUsersPageProps> = ({ currentPage, navigateTo, setIsAdmin }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ ...initialForm });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      setErrorMessage('فشل في تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelectedUser(null);
    setFormData({ ...initialForm });
    setErrorMessage(null);
    setSuccessMessage(null);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      password: '',
      phone: user.phone || '',
      role: user.role,
      country: user.address?.country || '',
      city: user.address?.city || '',
      street: user.address?.street || '',
      house_number: user.address?.house_number || '',
      floor: user.address?.floor || '',
    });
    setErrorMessage(null);
    setSuccessMessage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setFormData({ ...initialForm });
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.email || !formData.email.includes('@')) {
      setErrorMessage('الرجاء إدخال بريد إلكتروني صالح');
      return;
    }
    if (!selectedUser && (!formData.password || formData.password.length < 6)) {
      setErrorMessage('كلمة المرور مطلوبة ومكونة من 6 حروف على الأقل');
      return;
    }

    const payload: any = {
      name: formData.name || undefined,
      email: formData.email,
      password: selectedUser ? undefined : formData.password,
      phone: formData.phone || undefined,
      role: formData.role,
    };

    if (selectedUser) {
      const address = {
        country: formData.country || undefined,
        city: formData.city || undefined,
        street: formData.street || undefined,
        house_number: formData.house_number || undefined,
        floor: formData.floor || undefined,
      };
      if (Object.values(address).some(v => v)) payload.address = address;
    }

    try {
      setIsSaving(true);
      if (selectedUser) {
        await updateUser(selectedUser.id, payload);
        setSuccessMessage('تم تحديث بيانات المستخدم');
      } else {
        await createUser(payload);
        setSuccessMessage('تم إنشاء المستخدم بنجاح');
      }
      await loadUsers();
      setTimeout(() => closeModal(), 650);
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'حدث خطأ';
      setErrorMessage(String(msg));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error(err);
      setErrorMessage('فشل حذف المستخدم');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader currentPage={currentPage} navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
      <div className="flex">
        <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={openCreate}>
              <Plus className="w-4 h-4 ml-2" /> إضافة مستخدم جديد
            </Button>
          </div>

          {loading ? (
            <div className="text-center mt-10 text-gray-600">جارٍ تحميل المستخدمين...</div>
          ) : (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">البريد الإلكتروني</TableHead>
                      <TableHead className="text-right">الهاتف</TableHead>
                      <TableHead className="text-right">الدور</TableHead>
                      <TableHead className="text-right">العنوان</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name || '-'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || '-'}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          {user.address ? `${user.address.country || ''}, ${user.address.city || ''}, ${user.address.street || ''}` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEdit(user)}>
                              <Edit className="w-4 h-4 ml-2" /> تعديل
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-600" onClick={() => handleDelete(user.id)}>
                              <Trash2 className="w-4 h-4 ml-2" /> حذف
                            </Button>
                          </div>
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
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold text-purple-700">{selectedUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedUser ? 'قم بتحرير بيانات المستخدم ثم اضغط تحديث' : 'املأ الاسم، الإيميل وكلمة المرور لإنشاء مستخدم جديد'}
                </p>
              </div>
              <Button type="button" variant="ghost" onClick={closeModal} disabled={isSaving} className="text-gray-500 hover:text-gray-700">
                إغلاق
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {errorMessage && <div className="col-span-2 text-sm text-red-700 bg-red-50 border border-red-100 p-2 rounded">{errorMessage}</div>}
              {successMessage && <div className="col-span-2 text-sm text-green-700 bg-green-50 border border-green-100 p-2 rounded">{successMessage}</div>}

              {/* Name & Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">الاسم</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400" required />
              </div>

              {/* Password */}
              {!selectedUser && (
                <div className="flex flex-col gap-2 col-span-2">
                  <label className="text-sm font-medium text-gray-700">كلمة المرور</label>
                  <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="كلمة المرور" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400" required />
                </div>
              )}

              {/* Edit fields */}
              {selectedUser && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="رقم الهاتف" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">الدور</label>
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400">
                      <option value="USER">مستخدم</option>
                      <option value="ADMIN">مدير</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <hr className="my-2" />
                    <h3 className="font-semibold text-gray-700 mb-2">العنوان (اختياري)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input name="country" value={formData.country} onChange={handleChange} placeholder="الدولة" className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400" />
                      <input name="city" value={formData.city} onChange={handleChange} placeholder="المدينة" className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400" />
                      <input name="street" value={formData.street} onChange={handleChange} placeholder="الشارع" className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400" />
                      <div className="flex gap-2">
                        <input name="house_number" value={formData.house_number} onChange={handleChange} placeholder="رقم المنزل" className="w-1/2 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400" />
                        <input name="floor" value={formData.floor} onChange={handleChange} placeholder="الطابق" className="w-1/2 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-purple-400" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="col-span-2 flex flex-wrap justify-end gap-2 mt-4">
                {selectedUser && (
                  <Button type="button" variant="outline" onClick={() => openEdit(selectedUser)} disabled={isSaving}>إعادة تعيين</Button>
                )}
                <Button type="button" variant="outline" onClick={closeModal} disabled={isSaving}>إلغاء</Button>
                <Button type="submit" className={selectedUser ? 'bg-green-600 hover:bg-green-700 text-white font-bold' : 'bg-purple-600 hover:bg-purple-700 text-white font-bold'} disabled={isSaving}>
                  {isSaving ? (selectedUser ? 'جاري تحديث البيانات...' : 'جاري الإنشاء...') : (selectedUser ? 'تحديث بيانات المستخدم' : 'إنشاء المستخدم')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
