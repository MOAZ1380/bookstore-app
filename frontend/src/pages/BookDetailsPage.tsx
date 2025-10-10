// src/pages/BookDetailsPage.tsx
import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BookCard } from "../components/BookCard";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ShoppingCart, Heart, Truck } from "lucide-react";
import { sampleBooks } from "../data/mockData";
import { Page, Book as BookType } from "../types";
import { useWishlist } from "../hooks/useWishlist";
import { getBooksByCategory } from "../api/category";

interface BookDetailsPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  cartItems: BookType[];
  isLoggedIn: boolean;
  selectedBook: BookType;
  addToCart: (book: BookType) => void;
  setSelectedBook: (book: BookType) => void;
}

export const BookDetailsPage = ({
  currentPage,
  navigateTo,
  cartItems,
  isLoggedIn,
  selectedBook,
  addToCart,
  setSelectedBook,
}: BookDetailsPageProps) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [relatedBooks, setRelatedBooks] = useState<BookType[]>([]);
  const [isHover, setIsHover] = useState(false);

  const isInWishlist = wishlist.includes(selectedBook.id.toString());

  // return the books by category
  useEffect(() => {
    const fetchRelatedBooks = async () => {
      console.log(selectedBook);

      if (!selectedBook.categoryId) return;
      const res = await getBooksByCategory(selectedBook.categoryId);
      if (res.success && res.data) {
        setRelatedBooks(
          res.data.filter((book) => book.id !== selectedBook.id).slice(0, 4)
        );
      }
    };
    fetchRelatedBooks();
  }, [selectedBook]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        currentPage={currentPage}
        navigateTo={navigateTo}
        cartItems={cartItems}
        isLoggedIn={isLoggedIn}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* ✅ Badges */}
          <div className="flex items-center space-x-2 space-x-reverse mb-2">
            {selectedBook.isNew && (
              <Badge className="bg-green-600 text-xs sm:text-sm">جديد</Badge>
            )}
            {selectedBook.isBestseller && (
              <Badge className="bg-orange-600 text-xs sm:text-sm">
                الأكثر مبيعاً
              </Badge>
            )}
          </div>

          {/* ✅ العنوان والمؤلف */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
            {selectedBook.title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4">
            بقلم: {selectedBook.author}
          </p>

          {/* ✅ السعر والخصم */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 mb-6">
            <span className="text-2xl sm:text-3xl font-bold text-purple-600">
              {selectedBook.finalPrice} ج.م
            </span>

            {selectedBook.price > selectedBook.finalPrice && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Badge variant="destructive" className="text-xs">
                  خصم{" "}
                  {Math.round(
                    (1 - selectedBook.finalPrice / selectedBook.price) * 100
                  )}
                  %
                </Badge>
                <span className="text-lg sm:text-xl text-gray-500 line-through">
                  {selectedBook.price} ج.م
                </span>
              </div>
            )}
          </div>

          {/* ✅ الوصف */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold">وصف الكتاب</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {selectedBook.description}
            </p>
          </div>

          {/* ✅ معلومات إضافية */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
            {selectedBook.category?.name && (
              <div>
                <span className="font-bold">التصنيف:</span>{" "}
                {selectedBook.category.name}
              </div>
            )}
          </div>

          {/* ✅ الأزرار */}
          <div className="flex items-center sm:justify-start gap-3 sm:gap-4 mt-4">
            {/* زر السلة */}
            <Button
              onClick={() => addToCart(selectedBook)}
              size="lg"
              className="flex-1 sm:flex-initial bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              أضف إلى السلة
            </Button>

            {/* ✅ زر القلب الصغير */}
            <button
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              onClick={() => {
                if (!isLoggedIn) {
                  navigateTo("login");
                  return;
                }
                toggleWishlist(selectedBook.id.toString());
              }}
              className={`p-2 rounded-full border transition-all flex items-center justify-center
                ${
                  isInWishlist
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-300 bg-white"
                }
                ${isHover ? "shadow-md" : ""}
              `}
            >
              <Heart
                className={`w-4 h-4 sm:w-4 sm:h-4
                  ${isInWishlist ? "text-white fill-white" : "text-gray-600"}
                `}
              />
            </button>
          </div>

          {/* ✅ الشحن */}
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mt-4">
            <div className="flex items-center space-x-2 space-x-reverse text-blue-700">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-bold text-sm sm:text-base">شحن مجاني</span>
            </div>
          </div>
        </div>

        {/* ✅ كتب ذات صلة */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
            كتب ذات صلة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {relatedBooks.map((book) => (
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
                }}
                onClick={() => {
                  setSelectedBook(book);
                  navigateTo("book-details");
                }}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};
