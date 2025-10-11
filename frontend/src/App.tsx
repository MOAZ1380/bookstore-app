import { useState } from "react";
import { HomePage } from "./pages/user/HomePage";
import { CategoriesPage } from "./pages/user/CategoriesPage";
import { BookDetailsPage } from "./pages/user/BookDetailsPage";
import { CartPage } from "./pages/user/CartPage";
import { LoginPage } from "./pages/user/LoginPage";
import { RegisterPage } from "./pages/user/RegisterPage";
import { ForgotPasswordPage } from "./pages/user/ForgotPasswordPage";
import { OTPPage } from "./pages/user/OTPPage";
import { ResetPasswordPage } from "./pages/user/ResetPasswordPage";
import { MyOrdersPage } from "./pages/user/MyOrdersPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import AdminBooksPage from "./pages/admin/AdminBooksPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { Book, Page } from "./types";
import "./index.css";
import { WishlistPage } from "./pages/user/WishlistPage";

export const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [cartItems, setCartItems] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const navigateTo = (page: Page) => setCurrentPage(page);

  const addToCart = (book: Book) => {
    setCartItems([...cartItems, book]);
  };

  const removeFromCart = (bookId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== bookId));
  };

  const renderPage = () => {
    if (isAdmin) {
      switch (currentPage) {
        case "admin-dashboard":
          return (
            <AdminDashboardPage
              currentPage={currentPage}
              navigateTo={navigateTo}
              setIsAdmin={setIsAdmin}
            />
          );
        case "admin-categories":
          return (
            <AdminCategoriesPage
              currentPage={currentPage}
              navigateTo={navigateTo}
              setIsAdmin={setIsAdmin}
            />
          );
        case "admin-books":
          return (
            <AdminBooksPage
              currentPage={currentPage}
              navigateTo={navigateTo}
              setIsAdmin={setIsAdmin}
            />
          );
        case "admin-orders":
          return (
            <AdminOrdersPage
              currentPage={currentPage}
              navigateTo={navigateTo}
              setIsAdmin={setIsAdmin}
            />
          );
        case "admin-users":
          return (
            <AdminUsersPage
              currentPage={currentPage}
              navigateTo={navigateTo}
              setIsAdmin={setIsAdmin}
            />
          );
        case "admin-login":
          return (
            <AdminLoginPage navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
          );
        default:
          return (
            <AdminDashboardPage
              currentPage={currentPage}
              navigateTo={navigateTo}
              setIsAdmin={setIsAdmin}
            />
          );
      }
    }

    switch (currentPage) {
      case "home":
        return (
          <HomePage
            currentPage={currentPage}
            navigateTo={navigateTo}
            cartItems={cartItems}
            isLoggedIn={isLoggedIn}
            setSelectedBook={setSelectedBook}
            addToCart={addToCart}
          />
        );
      case "categories":
        return (
          <CategoriesPage
            currentPage={currentPage}
            navigateTo={navigateTo}
            cartItems={cartItems}
            isLoggedIn={isLoggedIn}
            setSelectedBook={setSelectedBook}
            addToCart={addToCart}
          />
        );
      case "book-details":
        return selectedBook ? (
          <BookDetailsPage
            currentPage={currentPage}
            navigateTo={navigateTo}
            cartItems={cartItems}
            isLoggedIn={isLoggedIn}
            selectedBook={selectedBook}
            addToCart={addToCart}
            setSelectedBook={setSelectedBook}
          />
        ) : (
          <HomePage
            currentPage={currentPage}
            navigateTo={navigateTo}
            cartItems={cartItems}
            isLoggedIn={isLoggedIn}
            setSelectedBook={setSelectedBook}
            addToCart={addToCart}
          />
        );
      case "cart":
        return (
          <CartPage
            currentPage={currentPage}
            navigateTo={navigateTo}
            cartItems={cartItems}
            isLoggedIn={isLoggedIn}
            removeFromCart={removeFromCart}
          />
        );
      case "login":
        return (
          <LoginPage navigateTo={navigateTo} setIsLoggedIn={setIsLoggedIn} />
        );
      case "register":
        return (
          <RegisterPage navigateTo={navigateTo} setIsLoggedIn={setIsLoggedIn} />
        );
      case "forgot-password":
        return <ForgotPasswordPage navigateTo={navigateTo} />;
      case "otp":
        return (
          <OTPPage
            navigateTo={navigateTo}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordPage
            navigateTo={navigateTo}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      case "my-orders":
        return (
          <MyOrdersPage
            currentPage={currentPage}
            navigateTo={navigateTo}
            cartItems={cartItems}
            isLoggedIn={isLoggedIn}
          />
        );
      case "admin-login":
        return (
          <AdminLoginPage navigateTo={navigateTo} setIsAdmin={setIsAdmin} />
        );
      case "wishlist":
        return (
          <WishlistPage
            currentPage={currentPage}
            navigateTo={navigateTo}
            cartItems={cartItems}
            isLoggedIn={isLoggedIn}
            addToCart={addToCart}
            setSelectedBook={setSelectedBook}
          />
        );
      default:
        return (
          <HomePage
            currentPage={currentPage}
            navigateTo={navigateTo}
            cartItems={cartItems}
            isLoggedIn={isLoggedIn}
            setSelectedBook={setSelectedBook}
            addToCart={addToCart}
          />
        );
    }
  };

  return <div>{renderPage()}</div>;
};
