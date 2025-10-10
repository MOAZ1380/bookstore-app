import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart } from "lucide-react";
import { Book } from "../types";
import { useWishlist } from "../hooks/useWishlist";
import { useState } from "react";

interface BookCardProps {
  book: Book;
  showAddToCart?: boolean;
  onClick?: () => void;
  onAddToCart?: (book: Book, quantity: number) => void; // ✅ نرسل الكمية
}

export const BookCard = ({
  book,
  showAddToCart = true,
  onClick,
  onAddToCart,
}: BookCardProps) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const [isHover, setIsHover] = useState(false);
  const [quantity, setQuantity] = useState(1); // ✅ حالة الكمية

  const isInWishlist = wishlist.includes(book.id.toString());

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      dir="rtl"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* ✅ صورة الكتاب */}
      <div onClick={onClick} className="flex-1 relative">
        <ImageWithFallback
          src={book.coverImage}
          alt={book.title}
          className="w-full h-56 sm:h-64 object-cover rounded-t-lg"
        />

        {/* ✅ الخصم */}
        {book.discount && (
          <Badge className="absolute top-2 left-2 bg-red-600 text-xs">
            خصم {book.discount}%
          </Badge>
        )}

        {/* ✅ زر المفضلة */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book.id.toString());
          }}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all 
            ${isInWishlist ? "bg-purple-600" : "bg-white/80"} 
            ${isHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          <Heart
            className={`w-4 h-4 ${
              isInWishlist ? "text-white fill-white" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* ✅ تفاصيل الكتاب */}
      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div onClick={onClick} className="flex-1">
          <h3 className="font-bold mb-1 text-right group-hover:text-purple-600 transition-colors text-sm sm:text-base line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-3 text-right">
            {book.author}
          </p>
        </div>

        {/* ✅ السعر */}
        {/* ✅ السعر والمخزون */}
        <div className="flex items-center justify-between mt-auto">
          <div className="text-right">
            <span className="text-base sm:text-lg font-bold text-purple-600">
              {book.finalPrice} ج.م
            </span>
            {book.price > book.finalPrice && (
              <span className="text-xs sm:text-sm text-gray-500 line-through mr-2 block sm:inline">
                {book.price} ج.م
              </span>
            )}

            {/* ✅ عرض المخزون */}
            <div className="text-xs sm:text-sm text-gray-500 mt-1">
              {book.stock > 0 ? (
                <span>
                  متاح:{" "}
                  <span className="font-semibold text-green-600">
                    {book.stock}
                  </span>{" "}
                  نسخة
                </span>
              ) : (
                <span className="text-red-600 font-semibold">غير متوفر</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* ✅ اختيار الكمية وزر الإضافة للسلة */}
      {showAddToCart && (
        <div className="p-4 pt-0 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="quantity" className="text-sm text-gray-700">
              الكمية:
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 border rounded-md text-center text-sm py-1"
            />
          </div>

          <Button
            onClick={() => onAddToCart?.(book, quantity)} // ✅ نمرر الكمية
            className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base py-2"
          >
            أضف إلى السلة
          </Button>
        </div>
      )}
    </Card>
  );
};
