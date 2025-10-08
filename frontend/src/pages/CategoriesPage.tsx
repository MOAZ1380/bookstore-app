import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BookCard } from '../components/BookCard';
import { Button } from '../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Filter, ArrowRight, ArrowLeft } from 'lucide-react';
import { sampleBooks, categories } from '../data/mockData';
import { Page, Book as BookType } from '../types';

interface CategoriesPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  cartItems: BookType[];
  isLoggedIn: boolean;
  setSelectedBook: (book: BookType) => void;
  addToCart: (book: BookType) => void;
}

export const CategoriesPage = ({ currentPage, navigateTo, cartItems, isLoggedIn, setSelectedBook, addToCart }: CategoriesPageProps) => (
  <div className="min-h-screen bg-gray-50" dir="rtl">
    <Header currentPage={currentPage} navigateTo={navigateTo} cartItems={cartItems} isLoggedIn={isLoggedIn} />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">تصفح الكتب</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 ml-2" />
              تصفية
            </Button>
          </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[...sampleBooks, ...sampleBooks, ...sampleBooks].map((book, index) => (
          <BookCard
            key={`${book.id}-${index}`}
            book={{ ...book, id: book.id + index * 10 }}
            onClick={() => {
              setSelectedBook(book);
              navigateTo('book-details');
            }}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="outline" size="sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-purple-600 text-white">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    <Footer navigateTo={navigateTo} />
  </div>
);