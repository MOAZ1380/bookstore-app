import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { BookCard } from "../../components/BookCard";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Book as BookType, Category, Page } from "../../types";
import { getAllBooks } from "../../api/book";
import { getAllCategories } from "../../api/category";
import { addCartItem } from "../../api/cart";
import { handleApiError } from "../../utils/handleApiError";

interface HomePageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  cartItems: BookType[];
  isLoggedIn: boolean;
  setSelectedBook: (book: BookType) => void;
}

export const HomePage = ({
  currentPage,
  navigateTo,
  cartItems,
  isLoggedIn,
  setSelectedBook,
}: HomePageProps) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [books, setBooks] = useState<BookType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorBooks, setErrorBooks] = useState<string | null>(null);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  // 🛒 إضافة كتاب إلى السلة
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

  // 📚 جلب الكتب
  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true);
      const result = await getAllBooks(page, limit);

      if (result.success && result.data) {
        setBooks(result.data.books);
        setTotalPages(Math.ceil(result.data.total / limit));
      } else {
        setErrorBooks(result.message || "فشل تحميل الكتب");
      }

      setLoadingBooks(false);
    };

    fetchBooks();
  }, [page, limit]);

  // 🏷️ جلب التصنيفات
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const result = await getAllCategories();

      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        setErrorCategories(result.message || "فشل تحميل التصنيفات");
      }

      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        currentPage={currentPage}
        navigateTo={navigateTo}
        cartItems={cartItems}
        isLoggedIn={isLoggedIn}
      />

      {/* 🟣 قسم البداية (Hero Section) */}
      <div className="bg-gradient-to-l from-purple-600 to-blue-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-right order-2 lg:order-1">
            <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
              اكتشف عالم الكتب العربية
            </h1>
            <p className="text-base lg:text-xl mb-8 text-blue-100 leading-relaxed">
              آلاف الكتب في جميع المجالات بين يديك. اقرأ، تعلم، واستمتع بأفضل
              الكتب العربية والمترجمة.
            </p>
            <Button
              onClick={() => navigateTo("categories")}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto"
            >
              تصفح الكتب
            </Button>
          </div>

          <div className="order-1 lg:order-2">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1588618319344-424aa94f749e?auto=format&fit=crop&w=1080&q=80"
              alt="مكتبة الكتب"
              className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* 🏷️ التصنيفات */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            تصفح حسب التصنيف
          </h2>
          <p className="text-gray-600">اختر من بين مجموعة واسعة من التصنيفات</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto px-4">
          {loadingCategories ? (
            <p className="text-center text-gray-500 col-span-full">
              جارٍ تحميل التصنيفات...
            </p>
          ) : errorCategories ? (
            <p className="text-center text-red-500 col-span-full">
              {errorCategories}
            </p>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              لا توجد تصنيفات حالياً.
            </p>
          ) : (
            categories.map((category) => (
              <Card
                key={category.id}
                className="text-center hover:shadow-md transition-all duration-300 cursor-pointer group mt-4"
                onClick={() => navigateTo("categories")}
              >
                <CardContent className="p-6 mt-2">
                  <h3 className="font-bold mb-1 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 📚 الكتب المميزة */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              الكتب المميزة
            </h2>
            <p className="text-gray-600">أحدث الإصدارات والكتب الأكثر مبيعاً</p>
          </div>

          {loadingBooks ? (
            <p className="text-center text-gray-500">جارٍ تحميل الكتب...</p>
          ) : errorBooks ? (
            <p className="text-center text-red-500">{errorBooks}</p>
          ) : books.length === 0 ? (
            <p className="text-center text-gray-500">لا توجد كتب حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={{
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    coverImage: `http://localhost:5000/uploads/books/${book.coverImage}`,
                    description: book.description,
                    discount: book.discount,
                    finalPrice: book.finalPrice,
                    category: book.category.name,
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
      </div>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};
