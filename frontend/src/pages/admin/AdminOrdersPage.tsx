import { useEffect, useState } from "react";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Eye, Edit } from "lucide-react";
import { Page } from "../../types";
import { getAllOrders, Order, updateOrderStatus } from "../../api/order";

interface AdminOrdersPageProps {
  currentPage: Page;
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminOrdersPage = ({
  currentPage,
  navigateTo,
  setIsAdmin,
}: AdminOrdersPageProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("❌ فشل في تحميل الطلبات:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("ar-EG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminHeader
        currentPage={currentPage}
        navigateTo={navigateTo}
        setIsAdmin={setIsAdmin}
      />
      <div className="flex">
        <AdminSidebar currentPage={currentPage} navigateTo={navigateTo} />
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
            إدارة الطلبات
          </h1>

          <Card>
            <CardContent className="p-4 sm:p-6">
              {loading ? (
                <p className="text-center text-gray-500">
                  جاري تحميل الطلبات...
                </p>
              ) : orders.length === 0 ? (
                <p className="text-center text-gray-500">لا توجد طلبات بعد.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطلب</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">عدد العناصر</TableHead>
                      <TableHead className="text-right">الكتب</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell>{order.totalPrice} ج.م</TableCell>
                        <TableCell>
                          <select
                            value={order.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as OrderStatus;
                              try {
                                await updateOrderStatus(order.id, newStatus);
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o.id === order.id
                                      ? { ...o, status: newStatus }
                                      : o
                                  )
                                );
                              } catch (error) {
                                console.error("فشل تحديث الحالة:", error);
                                alert("حدث خطأ أثناء تحديث حالة الطلب!");
                              }
                            }}
                            className={`rounded px-2 py-1 text-sm border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <option value="PENDING">قيد الانتظار</option>
                            <option value="PROCESSING">قيد المعالجة</option>
                            <option value="COMPLETED">مكتمل</option>
                            <option value="CANCELLED">ملغي</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          {order.orderItems?.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          ) || 0}
                        </TableCell>
                        <TableCell>
                          {order.orderItems
                            .map((item) => item.book.title)
                            .join("، ")}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => console.log("عرض الطلب", order.id)}
                            >
                              <Eye className="w-4 h-4 ml-2" />
                              عرض
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
