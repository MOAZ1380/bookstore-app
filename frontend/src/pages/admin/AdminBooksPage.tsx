import React, { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Page } from "../../types";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  Book,
} from "../../api/book";
import { getAllCategories } from "../../api/category";
import { Plus } from "lucide-react";

interface AdminBooksPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const initialForm = {
  title: "",
  author: "",
  description: "",
  price: 0,
  stock: 0,
  categoryId: 0,
  discount: 0,
  coverImage: null as File | null,
};

export const AdminBooksPage: React.FC<AdminBooksPageProps> = ({
  currentPage,
  navigateTo,
  setIsAdmin,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({ ...initialForm });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadBooks();
    loadCategories();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const res = await getAllBooks();
    if (res.success) setBooks(res.data);
    setLoading(false);
  };

  const loadCategories = async () => {
    const res = await getAllCategories();
    if (res.success) setCategories(res.data);
  };

  const openCreate = () => {
    setSelectedBook(null);
    setFormData({ ...initialForm });
    setErrorMessage(null);
    setSuccessMessage(null);
    setModalOpen(true);
  };

  const openEdit = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      stock: book.stock,
      categoryId: book.categoryId,
      discount: book.discount,
      coverImage: null,
    });
    setErrorMessage(null);
    setSuccessMessage(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
    setFormData({ ...initialForm });
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "coverImage")
      setFormData({ ...formData, coverImage: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.title.trim() || !formData.author.trim()) {
      setErrorMessage("العنوان والمؤلف مطلوبين");
      return;
    }

    const payload = new FormData();
    for (const key in formData) {
      if (formData[key as keyof typeof formData] !== null) {
        payload.append(key, formData[key as keyof typeof formData] as any);
      }
    }

    try {
      setIsSaving(true);
      let res;
      if (selectedBook) res = await updateBook(selectedBook.id, payload);
      else res = await createBook(payload);

      if (res.success) {
        setSuccessMessage(selectedBook ? "تم تحديث الكتاب" : "تم إنشاء الكتاب");
        loadBooks();
        setTimeout(closeModal, 500);
      } else {
        setErrorMessage(res.message || "حدث خطأ أثناء الحفظ");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الكتاب؟")) return;

    try {
      const res = await deleteBook(id);
      if (res.success) {
        setSuccessMessage("تم حذف الكتاب بنجاح");
        loadBooks();
      } else setErrorMessage(res.message || "فشل حذف الكتاب");
    } catch (err) {
      console.error(err);
      setErrorMessage("فشل حذف الكتاب");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader
        currentPage={currentPage}
        navigateTo={navigateTo}
        setIsAdmin={setIsAdmin}
      />
      <div className="flex">
        <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              إدارة الكتب
            </h1>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={openCreate}
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة كتاب جديد
            </Button>
          </div>

          {loading ? (
            <div className="text-center mt-10 text-gray-600">
              جارٍ تحميل الكتب...
            </div>
          ) : (
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
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>
                          <ImageWithFallback
                            src={book.coverImage || ""}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.price} ج.م</TableCell>
                        <TableCell>
                          {categories.find((c) => c.id === book.categoryId)
                            ?.name || "-"}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(book)}
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600"
                            onClick={() => handleDelete(book.id)}
                          >
                            حذف
                          </Button>
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
        <div className="relative inset-0 flex items-start justify-center bg-black bg-opacity-50 z-50 p-4 pt-16">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-gray-200 overflow-y-auto max-h-[80vh]">
            {/* Header */}
            <div className="flex justify-between items-center bg-purple-600 text-white px-4 py-2 rounded-t-xl">
              <h2 className="text-lg font-bold">
                {selectedBook ? "تعديل الكتاب" : "إضافة كتاب جديد"}
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200"
              >
                ✖
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-4 grid gap-4">
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

              <div className="flex flex-col gap-1">
                <Label>العنوان</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>المؤلف</Label>
                <Input
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>الوصف</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>السعر</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>المخزون</Label>
                <Input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>التصنيف</Label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                >
                  <option value={0}>اختر التصنيف</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <Label>الخصم (%)</Label>
                <Input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>صورة الغلاف</Label>
                <Input type="file" name="coverImage" onChange={handleChange} />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  إغلاق
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "جاري الحفظ..."
                    : selectedBook
                    ? "تحديث"
                    : "إنشاء"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooksPage;
