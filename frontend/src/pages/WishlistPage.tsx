import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../api/whishlist";
import { addCartItem } from "../api/cart";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BookCard } from "../components/BookCard";
import { Button } from "../components/ui/Button";
import { Page, Book as BookType, Category } from "../types";
import { handleApiError } from "../utils/handleApiError";

interface WishlistPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  cartItems: BookType[];
  isLoggedIn: boolean;
  addToCart: (book: BookType) => void;
  setSelectedBook: (book: BookType) => void;
}

export const WishlistPage = ({
  currentPage,
  navigateTo,
  cartItems,
  isLoggedIn,
  addToCart,
  setSelectedBook,
}: WishlistPageProps) => {
  const [wishlist, setWishlist] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingBookId, setAddingBookId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchWishlist() {
      try {
        const data = await getWishlist();
        setWishlist(data.map((item) => item.book));
      } catch (err) {
        const message = handleApiError(err);
        console.error("❌ Failed to fetch wishlist:", message);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [isLoggedIn]);

  const handleRemove = async (bookId: number) => {
    try {
      await removeFromWishlist(String(bookId));
      setWishlist((prev) => prev.filter((b) => b.id !== bookId));
    } catch (error) {
      const message = handleApiError(error);
      console.error("❌ Failed to remove from wishlist:", error);
      alert(message);
    }
  };

  // ✅ نفس منطق BookDetailsPage
  const handleAddToCart = async (book: Book, quantity: number = 1) => {
    if (!isLoggedIn) {
      navigateTo("login");
      return;
    }

    try {
      setAddingBookId(book.id);
      const res = await addCartItem({
        bookId: book.id, // ✅ زي ما عامل في BookDetailsPage
        quantity,
      });

      console.log("✅ Added to cart:", res);
      addToCart(book);
      alert("تمت إضافة المنتج إلى السلة بنجاح 🛒");
    } catch (error: any) {
      const message = handleApiError(error);
      console.error("❌ Error adding to cart:", message);
      alert(message);
    } finally {
      setAddingBookId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
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
            {wishlist.map((book) => {
              return (
                <BookCard
                  key={book.id}
                  book={{
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    price: Number(book.price),
                    coverImage: `http://localhost:5000/uploads/books/${book.coverImage}`,
                    description: book.description,
                    discount: book.discount,
                    finalPrice:
                      Number(book.price) -
                      (Number(book.price) * (book.discount || 0)) / 100,
                    category: book.category?.name || "غير مصنف",
                    stock: book.stock,
                  }}
                  onClick={() => {
                    setSelectedBook({
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      price: Number(book.price),
                      coverImage: `http://localhost:5000/uploads/books/${book.coverImage}`,
                      description: book.description,
                      discount: book.discount,
                      finalPrice:
                        Number(book.price) -
                        (Number(book.price) * (book.discount || 0)) / 100,
                      category: book.category?.name || "غير مصنف",
                      stock: book.stock,
                      categoryId: book.categoryId,
                    });
                    navigateTo("book-details");
                  }}
                  onAddToCart={(book, quantity) =>
                    handleAddToCart(book, quantity)
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};
