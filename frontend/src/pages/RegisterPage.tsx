import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Book } from "lucide-react";
import { Page } from "../types";
import { registerUser } from "../api/auth"; // 👈 سننشئه بعد قليل
import { handleApiError } from "../utils/handleApiError";

interface RegisterPageProps {
  navigateTo: (page: Page) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const RegisterPage = ({
  navigateTo,
  setIsLoggedIn,
}: RegisterPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    setError(null);

    if (!validateEmail(email)) {
      setError("الرجاء إدخال بريد إلكتروني صالح");
      return;
    }
    if (password.length < 6) {
      setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(email, password);

      if (response.success) {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsLoggedIn(true);
        navigateTo("home");
      } else {
        const message = handleApiError(error);
        console.error("❌ Error registering user:", error);
        alert(message);
        setError(response.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (error) {
      const message = handleApiError(error);
      console.error("❌ Error registering user:", error);
      alert(message);
      setError("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center"
      dir="rtl"
    >
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
            <p className="text-gray-600">انضم إلى عالم الكتب استور اليوم</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-100 text-red-600 p-2 rounded text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="text-right"
                dir="rtl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                className="text-right"
                dir="rtl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="أعد إدخال كلمة المرور"
                className="text-right"
                dir="rtl"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </Button>

            <div className="text-center">
              <span className="text-gray-600">لديك حساب بالفعل؟ </span>
              <button
                onClick={() => navigateTo("login")}
                className="text-purple-600 hover:underline"
              >
                تسجيل الدخول
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
