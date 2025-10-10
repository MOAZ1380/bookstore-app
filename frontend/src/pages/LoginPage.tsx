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
import { Book, Settings } from "lucide-react";
import { Page } from "../types";
import { loginUser } from "../api/auth";

interface LoginPageProps {
  navigateTo: (page: Page) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const LoginPage = ({ navigateTo, setIsLoggedIn }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setError(null);

    if (!validateEmail(email)) {
      setError("الرجاء إدخال بريد إلكتروني صالح");
      return;
    }
    if (!password || password.length < 6) {
      setError("الرجاء إدخال كلمة مرور صحيحة (6 أحرف على الأقل)");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(email, password);

      if (response.success) {
        setPassword("");
        setEmail("");
        setIsLoggedIn(true);
        navigateTo("home");
      } else {
        setError(response.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center relative"
      dir="rtl"
    >
      {/* ✅ أيقونة الإعدادات في أسفل يسار الصفحة */}
      <button
        onClick={() => navigateTo("admin-login")}
        className="absolute bottom-4 left-4 p-2 text-gray-500 hover:text-purple-600 transition"
        title="إعدادات الإدارة"
      >
        <Settings className="w-6 h-6" />
      </button>

      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
            <p className="text-gray-600">أدخل بياناتك للوصول إلى حسابك</p>
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

            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateTo("forgot-password")}
                className="text-sm text-purple-600 hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>

            <div className="text-center">
              <span className="text-gray-600">ليس لديك حساب؟ </span>
              <button
                onClick={() => navigateTo("register")}
                className="text-purple-600 hover:underline"
              >
                إنشاء حساب جديد
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
