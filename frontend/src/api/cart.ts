// src/api/cart.ts
import axiosClient from "./axiosClient";

export interface CreateCartDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartDto {
  quantity: number;
}

// Add item to cart
export async function addCartItem(dto: CreateCartDto) {
  const response = await axiosClient.post("cart", dto);
  return response.data;
}

// Get all items in user's cart
export async function getCartItems() {
  try {
    const response = await axiosClient.get("cart");
    return {success: true, data: response.data};


  } catch (error) {
    return {success: false, message: error.message || "حدث خطأ ما"};
  }
}

// Update specific cart item by ID
export async function updateCartItem(id: number, dto: UpdateCartDto) {
  const response = await axiosClient.patch(`cart/${id}`, dto);
  return response.data;
}

// Remove a specific item from cart
export async function removeCartItem(id: number) {
  const response = await axiosClient.delete(`cart/${id}`);
  return response.data;
}

// Clear all items from the user's cart
export async function clearCart() {
  const response = await axiosClient.delete("cart");
  return response.data;
}
