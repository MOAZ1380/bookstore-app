import React, { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Edit, Trash2, Plus } from "lucide-react";
import { Page } from "../../types";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/users";

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

export const AdminUsersPage = ({ currentPage, navigateTo, setIsAdmin }: AdminUsersPageProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
    country: "",
    city: "",
    street: "",
    house_number: "",
    floor: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Fetch users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("❌ Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "USER",
      country: "",
      city: "",
      street: "",
      house_number: "",
      floor: "",
    });
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(false);
  };

  // ✅ Submit Add/Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // basic validation
    if (!formData.email || !formData.email.includes('@')) {
      setErrorMessage('الرجاء إدخال بريد إلكتروني صالح');
      return;
    }
    if (!selectedUser && (!formData.password || formData.password.length < 6)) {
      setErrorMessage('كلمة المرور مطلوبة ولا بد أن تكون 6 حروف على الأقل عند إنشاء مستخدم جديد');
      return;
    }
    // Build DTO: do NOT include address on create; include address on edit only if any field provided
    const dtoBase: any = {
      name: formData.name || undefined,
      email: formData.email,
      password: selectedUser ? undefined : formData.password, // فقط للمستخدم الجديد
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
      const hasAddress = Object.values(address).some((v) => v !== undefined && v !== '');
      if (hasAddress) dtoBase.address = address;
    }

    const dto = dtoBase;

    try {
      setIsSaving(true);
      if (selectedUser) {
        await updateUser(selectedUser.id, dto);
        setSuccessMessage('تم تعديل المستخدم بنجاح');
      } else {
        await createUser(dto);
        setSuccessMessage('تم إنشاء المستخدم بنجاح');
      }
      await loadUsers();
      // give a small delay so user can see success message then close
      setTimeout(() => {
        closeModal();
      }, 650);
    } catch (error) {
      console.error("❌ Error saving user:", error);
      // try to show server message
      const msg = (error as any)?.response?.data?.message || 'حدث خطأ أثناء حفظ المستخدم، تأكد من البيانات وحاول مرة أخرى.';
      setErrorMessage(String(msg));
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Delete
  const handleDelete = async (id: number) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) {
      try {
        await deleteUser(id);
        await loadUsers();
      } catch (error) {
        console.error("❌ Error deleting user:", error);
        alert("حدث خطأ أثناء حذف المستخدم.");
      }
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-600">جارٍ تحميل المستخدمين...</div>;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader currentPage={currentPage} navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
      <div className="flex">
        <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setModalOpen(true)}
            >
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
                    <TableHead className="text-right">الهاتف</TableHead>
                    <TableHead className="text-right">الدور</TableHead>
                    <TableHead className="text-right">العنوان</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {user.address
                          ? `${user.address.country || ""}, ${user.address.city || ""}, ${user.address.street || ""}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2 space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setFormData({
                                name: user.name || "",
                                email: user.email,
                                password: "",
                                phone: user.phone || "",
                                role: user.role,
                                country: user.address?.country || "",
                                city: user.address?.city || "",
                                street: user.address?.street || "",
                                house_number: user.address?.house_number || "",
                                floor: user.address?.floor || "",
                              });
                              setModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600"
                            onClick={() => handleDelete(user.id)}
                          >
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

      {/* ✅ Modal */}
      {modalOpen && (
        // top-aligned wide overlay so the form is visible immediately
        <div className="fixed top-0 left-0 right-0 flex items-start justify-center bg-black bg-opacity-50 z-50 py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl overflow-y-auto max-h-[85vh]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedUser ? "تعديل المستخدم" : "إضافة مستخدم جديد"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{selectedUser ? 'قم بتحرير بيانات المستخدم ثم اضغط حفظ' : 'املأ الاسم، الإيميل وكلمة المرور لإنشاء مستخدم جديد'}</p>
              </div>
              <div>
                <Button type="button" variant="ghost" onClick={closeModal} disabled={isSaving}>
                  إغلاق
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3">
              {errorMessage && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-100 p-2 rounded">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-100 p-2 rounded">
                  {successMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">الاسم</label>
                <input
                  type="text"
                  name="name"
                  placeholder="الاسم"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  placeholder="البريد الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              {!selectedUser && (
                <div className="grid grid-cols-1 gap-2">
                  <label className="text-sm font-medium">كلمة المرور</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              )}

              {selectedUser && (
                <>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="text-sm font-medium">رقم الهاتف</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="رقم الهاتف"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <label className="text-sm font-medium">الدور</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="USER">مستخدم</option>
                      <option value="ADMIN">مدير</option>
                    </select>
                  </div>

                  <hr className="my-2" />
                  <h3 className="font-semibold text-gray-700">العنوان (اختياري)</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      name="country"
                      placeholder="الدولة"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="المدينة"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      name="street"
                      placeholder="الشارع"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="house_number"
                        placeholder="رقم المنزل"
                        value={formData.house_number}
                        onChange={handleChange}
                        className="w-1/2 border rounded-lg px-3 py-2"
                      />
                      <input
                        type="text"
                        name="floor"
                        placeholder="الطابق"
                        value={formData.floor}
                        onChange={handleChange}
                        className="w-1/2 border rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 mt-3">
                {selectedUser && (
                  <Button type="button" variant="outline" onClick={() => {
                    // reset form to original user values
                    if (selectedUser) {
                      setFormData({
                        name: selectedUser.name || '',
                        email: selectedUser.email,
                        password: '',
                        phone: selectedUser.phone || '',
                        role: selectedUser.role,
                        country: selectedUser.address?.country || '',
                        city: selectedUser.address?.city || '',
                        street: selectedUser.address?.street || '',
                        house_number: selectedUser.address?.house_number || '',
                        floor: selectedUser.address?.floor || '',
                      });
                      setErrorMessage(null);
                      setSuccessMessage(null);
                    }
                  }} disabled={isSaving}>
                    إعادة تعيين
                  </Button>
                )}

                <Button type="button" variant="outline" onClick={closeModal} disabled={isSaving}>
                  إلغاء
                </Button>

                <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSaving}>
                  {isSaving ? (selectedUser ? 'جاري الحفظ...' : 'جاري الإنشاء...') : (selectedUser ? 'حفظ التعديلات' : 'إنشاء المستخدم')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
