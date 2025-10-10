import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ShoppingBag, Eye, Check, Truck, Clock } from "lucide-react";
import { sampleOrders } from "../data/mockData";
import { Page } from "../types";

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
}: MyOrdersPageProps) => (
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

      {sampleOrders.length === 0 ? (
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
          {sampleOrders.map((order) => (
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
                      <span className="text-gray-600">{order.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="font-bold text-sm sm:text-base">
                        الإجمالي:
                      </span>
                      <span className="text-purple-600 font-bold">
                        {order.total} ر.س
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="font-bold text-sm sm:text-base">
                        الحالة:
                      </span>
                      <Badge className={order.statusColor}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="font-bold text-sm sm:text-base">
                        الكتب:
                      </span>
                      <span className="text-gray-600 text-sm line-clamp-2">
                        {order.books.join(", ")}
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
                    {order.status === "قيد المعالجة" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
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
