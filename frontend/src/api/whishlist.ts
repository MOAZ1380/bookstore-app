import axiosClient from "./axiosClient";

export const addToWishlist = async (bookId: string) => {
  const response = await axiosClient.post(`/wishlist/${bookId}`);
  return response.data;
};

export const removeFromWishlist = async (bookId: string) => {
  const response = await axiosClient.delete(`/wishlist/${bookId}`);
  return response.data;
};

export const getWishlist = async () => {
  const response = await axiosClient.get("/wishlist");
  return response.data;
};