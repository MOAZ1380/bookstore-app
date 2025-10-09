import { useState, useEffect } from "react";
import { addToWishlist, removeFromWishlist, getWishlist } from "../api/whishlist";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist();
        setWishlist(data.map((item: any) => item.book.id.toString()));
      } catch {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, []);

  const toggleWishlist = async (bookId: string) => {
    setLoading(true);
    try {
      if (wishlist.includes(bookId)) {
        await removeFromWishlist(bookId);
        setWishlist((prev) => prev.filter((id) => id !== bookId));
      } else {
        await addToWishlist(bookId);
        setWishlist((prev) => [...prev, bookId]);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert("يجب تسجيل الدخول أولاً لإضافة إلى المفضلة ");
      } else {
        alert(err.message || "حدث خطأ أثناء تحديث المفضلة");
      }
    } finally {
      setLoading(false);
    }
  };

  return { wishlist, toggleWishlist, loading };
};
