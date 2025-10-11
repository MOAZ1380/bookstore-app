// src/api/order.ts
import axiosClient from "./axiosClient";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}


export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  book: {
    id: number;
    title: string;
    author: string;
    coverImage: string;
  };
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  items: OrderItem[];
}

// ✅ إنشاء طلب جديد من السلة
export async function createOrder() {
  try {
    const response = await axiosClient.post("orders");
     return response.data;
  } catch (error) {
    throw error;
  }
}

// ✅ جلب كل الطلبات (لـ ADMIN فقط)
export async function getAllOrders() {
  const response = await axiosClient.get("orders");
  return response.data as Order[];
}

// ✅ جلب كل الطلبات الخاصة بالمستخدم الحالي
export async function getMyOrders() {
  const response = await axiosClient.get("orders/me");
  return response.data as Order[];
}

// ✅ جلب طلب محدد للمستخدم
export async function getOrderById(id: number) {
  const response = await axiosClient.get(`orders/${id}`);
  return response.data as Order;
}

// ✅ إلغاء الطلب (يغير الحالة إلى CANCELLED)
export async function cancelOrder(id: number) {
  const response = await axiosClient.patch(`orders/${id}`);
  return response.data;
}

// ✅ جلب جميع طلبات مستخدم معين (ADMIN فقط)
export async function getOrdersByUser(userId: number) {
  const response = await axiosClient.get(`orders/user/${userId}`);
  return response.data as Order[];
}

// ✅ تحديث حالة الطلب بواسطة ADMIN
export async function updateOrderStatus(id: number, status: OrderStatus) {
  const response = await axiosClient.patch(`orders/${id}/status`, { status });
  return response.data;
}
