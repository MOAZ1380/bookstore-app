import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../api/whishlist";
import { Button } from "../components/ui/Button";
import { BookCard } from "../components/BookCard";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Page, Book } from "../types";

interface WishlistPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  cartItems: Book[];
  isLoggedIn: boolean;
}

export const WishlistPage = ({
  currentPage,
  navigateTo,
  cartItems,
  isLoggedIn,
}: WishlistPageProps) => {
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return; // ✅ ما تعملش fetch لو مش داخل
    async function fetchWishlist() {
      try {
        const data = await getWishlist();
        setWishlist(data);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, [isLoggedIn]);

  async function handleRemove(bookId: number) {
    try {
      await removeFromWishlist(String(bookId));
      setWishlist((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* ✅ Header */}
      <Header
        currentPage={currentPage}
        navigateTo={navigateTo}
        cartItems={cartItems}
        isLoggedIn={isLoggedIn}
      />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-purple-700 text-center mt-4">
          قائمة المفضلة
        </h1>

        {/* ✅ لو المستخدم مش داخل */}
        {!isLoggedIn ? (
          <div className="text-center text-gray-600">
            <p className="text-lg mb-4">يجب تسجيل الدخول لعرض قائمة المفضلة</p>
            <Button
              onClick={() => navigateTo("login")}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              تسجيل الدخول
            </Button>
          </div>
        ) : loading ? (
          <p className="text-center text-gray-500">جارٍ تحميل المفضلة...</p>
        ) : wishlist.length === 0 ? (
          <p className="text-center text-gray-500">قائمة المفضلة فارغة</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((book) => (
              <div
                key={book.id}
                className="border rounded-lg p-3 shadow-sm hover:shadow-md transition"
              >
                <BookCard
                  book={{
                    id: book.book.id,
                    title: book.book.title,
                    author: book.book.author,
                    price: Number(book.book.price),
                    coverImage: `http://localhost:5000/uploads/books/${book.book.coverImage}`,
                    description: book.book.description,
                    discount: book.book.discount,
                    finalPrice:
                      Number(book.book.price) -
                      (Number(book.book.price) * (book.book.discount || 0)) / 100,
                    category: book.book.category?.name || "غير مصنف",
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Footer */}
      <Footer navigateTo={navigateTo} />
    </div>
  );
};
