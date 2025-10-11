import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ShoppingBag, Eye } from "lucide-react";
import { getMyOrders, cancelOrder, OrderStatus } from "../../api/order";
import { Page } from "../../types";
import { handleApiError } from "../../utils/handleApiError";

interface MyOrdersPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  cartItems: any[];
  isLoggedIn: boolean;
}

export const MyOrdersPage = ({
  currentPage,
  navigateTo,
  cartItems,
  isLoggedIn,
}: MyOrdersPageProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleCancelOrder = async (id: number) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;
    try {
      await cancelOrder(id);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: OrderStatus.CANCELLED } : order
        )
      );
    } catch (error) {
      const message = handleApiError(error);
      console.error("❌ Error cancelling order:", error);
      alert(message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return "قيد المعالجة";
      case "COMPLETED":
        return "مكتمل";
      case "CANCELLED":
        return "ملغي";
      default:
        return status;
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          طلباتي
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">جاري تحميل الطلبات...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              لا توجد طلبات
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              لم تقم بإنشاء أي طلبات بعد
            </p>
            <Button
              onClick={() => navigateTo("categories")}
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            >
              تصفح الكتب
            </Button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-bold text-sm sm:text-base">
                          رقم الطلب:
                        </span>
                        <span className="text-gray-600">{order.id}</span>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-bold text-sm sm:text-base">
                          التاريخ:
                        </span>
                        <span className="text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "ar-EG"
                          )}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-bold text-sm sm:text-base">
                          الإجمالي:
                        </span>
                        <span className="text-purple-600 font-bold">
                          {parseFloat(order.totalPrice)} ر.س
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-bold text-sm sm:text-base">
                          الحالة:
                        </span>
                        <Badge className={getStatusBadge(order.status)}>
                          {translateStatus(order.status)}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-bold text-sm sm:text-base">
                          الكتب:
                        </span>
                        <span className="text-gray-600 text-sm line-clamp-2">
                          {order.orderItems
                            ?.map((item: any) => item.book.title)
                            .join("، ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-purple-600 border-purple-600 hover:bg-purple-50"
                      >
                        <Eye className="w-4 h-4 ml-2" />
                        عرض التفاصيل
                      </Button>

                      {order.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          إلغاء الطلب
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer navigateTo={navigateTo} />
    </div>
  );
};
