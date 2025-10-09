import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookCard } from '../components/BookCard';
import { Button } from '../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Filter, ArrowRight, ArrowLeft } from 'lucide-react';
import { Page, Book as BookType, Category } from '../types';
import { getAllBooks } from '../api/book';
import { getAllCategories } from '../api/category';

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
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🧭 Fetch books and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksRes, categoriesRes] = await Promise.all([getAllBooks(), getAllCategories()]);
        if (booksRes.success && booksRes.data) {
          setBooks(booksRes.data);
          setFilteredBooks(booksRes.data);
        } else {
          setError(booksRes.message || 'فشل تحميل الكتب');
        }
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
      } catch (err) {
        setError('حدث خطأ أثناء تحميل البيانات');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 🧩 Filter books when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter((b) => b.category?.name === selectedCategory));
    }
  }, [selectedCategory, books]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header currentPage={currentPage} navigateTo={navigateTo} cartItems={cartItems} isLoggedIn={isLoggedIn} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">تصفح الكتب</h1>

          <div className="flex flex-col gap-4">
            {/* 🧭 Category Select */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <Select onValueChange={(val) => setSelectedCategory(val)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
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

            {/* 🧭 Sort Select */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <span className="text-sm text-gray-600">ترتيب حسب:</span>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="الأحدث" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">الأحدث</SelectItem>
                  <SelectItem value="price-low">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price-high">السعر: من الأعلى للأقل</SelectItem>
                  <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 🧭 Books Section */}
        {loading ? (
          <p className="text-center text-gray-500">جارٍ تحميل الكتب...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredBooks.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد كتب في هذا التصنيف.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={{
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  price: book.price,
                  description: book.description,
                  coverImage: `http://localhost:5000/uploads/${book.coverImage}`,
                  discount: book.discount,
                  finalPrice: book.finalPrice,
                  category: book.category?.name || '',
                }}
                onClick={() => {
                  setSelectedBook(book);
                  navigateTo('book-details');
                }}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}

        {/* 🧭 Pagination (ثابت زي ما هو) */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button variant="outline" size="sm">
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-purple-600 text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};
