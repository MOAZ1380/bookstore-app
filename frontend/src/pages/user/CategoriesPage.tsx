import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { BookCard } from "../../components/BookCard";
import { Button } from "../../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { Filter, ArrowRight, ArrowLeft } from "lucide-react";
import { Page, Book as BookType, Category } from "../../types";
import { getAllCategories, getBooksByCategory } from "../../api/category"; // استدعاء الدوال

import { getAllBooks } from "../../api/book";
import { handleApiError } from "../../utils/handleApiError";
import { addCartItem } from "../../api/cart";

interface CategoriesPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  cartItems: BookType[];
  isLoggedIn: boolean;
  setSelectedBook: (book: BookType) => void;
  addToCart: (book: BookType) => void;
}

export const CategoriesPage = ({
  currentPage,
  navigateTo,
  cartItems,
  isLoggedIn,
  setSelectedBook,
  addToCart,
}: CategoriesPageProps) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [books, setBooks] = useState<BookType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">(
    "all"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async (book: BookType, quantity: number) => {
    try {
      const response = await addCartItem({
        bookId: book.id,
        quantity,
      });
      alert("تمت إضافة الكتاب إلى السلة بنجاح ✅");
    } catch (error) {
      const message = handleApiError(error);
      console.error("❌ Error adding to cart:", error);
      alert(message);
    }
  };

  // 🧭 Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getAllCategories();
        if (res.success && res.data) setCategories(res.data);
      } catch (err) {
        setCategories([]);
        setError("فشل تحميل التصنيفات");
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  // 🧭 Fetch books (all or by category)
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let res;
        if (selectedCategoryId === "all") {
          res = await getAllBooks(page, limit);
        } else {
          res = await getBooksByCategory(
            Number(selectedCategoryId),
            page,
            limit
          );
        }

        if (res.success && res.data) {
          setBooks(res.data.books);
          setTotalPages(Math.ceil(res.data.total / limit));
        } else {
          setBooks([]);
        }
      } catch (err) {
        const message = handleApiError(err);
        console.error("❌ Error fetching books:", err);
        alert(message);
        setError("فشل تحميل الكتب");
      }
      setLoading(false);
    };
    fetchBooks();
  }, [selectedCategoryId, page, limit]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        currentPage={currentPage}
        navigateTo={navigateTo}
        cartItems={cartItems}
        isLoggedIn={isLoggedIn}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          تصفح الكتب
        </h1>

        {/* Category Select */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-6">
          <Select
            onValueChange={(val) =>
              setSelectedCategoryId(val === "all" ? "all" : Number(val))
            }
            value={selectedCategoryId.toString()}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="اختر التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التصنيفات</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>

        {/* Books Section */}
        {loading ? (
          <p className="text-center text-gray-500">جارٍ تحميل الكتب...</p>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-500">
            لا توجد كتب في هذا التصنيف.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={{
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  price: book.price,
                  description: book.description,
                  coverImage: `http://localhost:5000/uploads/books/${book.coverImage}`,
                  discount: book.discount,
                  finalPrice: book.finalPrice,
                  category: book.category?.name || "",
                  stock: book.stock,
                }}
                onClick={() => {
                  setSelectedBook(book);
                  navigateTo("book-details");
                }}
                onAddToCart={(book, quantity) =>
                  handleAddToCart(book, quantity)
                }
              />
            ))}
          </div>
        )}

        <div className="flex justify-center items-center mt-8 gap-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            السابق
          </Button>
          <span className="text-gray-700 text-sm">
            الصفحة {page} من {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            التالي
          </Button>
        </div>
      </div>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};
