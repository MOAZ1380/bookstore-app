import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Separator } from "../components/ui/Separator";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Page } from "../types";
import { getCartItems, removeCartItem } from "../api/cart";

interface CartItem {
  id: number;
  quantity: number;
  book: {
    id: number;
    title: string;
    author: string;
    price: string;
    discount: number;
    coverImage: string;
  };
}

interface CartPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  isLoggedIn: boolean;
}

export const CartPage = ({
  currentPage,
  navigateTo,
  isLoggedIn,
}: CartPageProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🛒 تحميل بيانات السلة من السيرفر
  useEffect(() => {
    async function fetchCart() {
      const response = await getCartItems();
      if (response.success) {
        setCartItems(response.data);
        setError(null);
      } else {
        setError(response.message || "حدث خطأ ما");
      }
      setLoading(false);
    }
    fetchCart();
  }, []);

  // 🧮 حساب المجموع
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.book.price) * item.quantity,
    0
  );

  const handleRemove = async (id: number) => {
    await removeCartItem(id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        currentPage={currentPage}
        navigateTo={navigateTo}
        cartItems={[]}
        isLoggedIn={isLoggedIn}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          سلة التسوق
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">جارٍ تحميل السلة...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              سلة التسوق فارغة
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              لم تقم بإضافة أي كتب إلى السلة بعد
            </p>
            <Button
              onClick={() => navigateTo("categories")}
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              تصفح الكتب
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>الكتب المحددة ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 sm:space-x-4 space-x-reverse p-3 sm:p-4 border rounded-lg"
                    >
                      <ImageWithFallback
                        src={`http://localhost:5000/uploads/${item.book.coverImage}`}
                        alt={item.book.title}
                        className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 text-right min-w-0">
                        <h3 className="font-bold text-sm sm:text-base line-clamp-2">
                          {item.book.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          {item.book.author}
                        </p>
                        <p className="text-purple-600 font-bold text-sm sm:text-base">
                          {item.book.price} ج.م × {item.quantity}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span>الشحن:</span>
                    <span className="text-green-600">مجاني</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>المجموع الكلي:</span>
                    <span className="text-purple-600">
                      {subtotal.toFixed(2)} ج.م
                    </span>
                  </div>

                  {!isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-yellow-800 text-xs sm:text-sm text-center">
                          يجب تسجيل الدخول لإتمام الطلب
                        </p>
                      </div>
                      <Button
                        onClick={() => navigateTo("login")}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        تسجيل الدخول
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      إتمام الطلب
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};
