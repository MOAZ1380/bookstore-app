import { useState } from "react";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Settings } from "lucide-react";
import { Page } from "../../types";
import { loginUser } from "../../api/auth"; // استدعاء دالة تسجيل الدخول

interface AdminLoginPageProps {
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminLoginPage = ({
  navigateTo,
  setIsAdmin,
}: AdminLoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      setIsAdmin(true);
      navigateTo("admin-dashboard");
    } else {
      setError(result.message || "حدث خطأ أثناء تسجيل الدخول");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center"
      dir="rtl"
    >
      <div className="max-w-md w-full mx-4">
        <button
          onClick={() => navigateTo("login")}
          className="absolute bottom-4 left-4 p-2 text-gray-500 hover:text-purple-600 transition"
          title="إعدادات الإدارة"
        >
          <Settings className="w-6 h-6" />
        </button>
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">تسجيل دخول الإدارة</CardTitle>
            <p className="text-gray-600">
              أدخل بيانات الإدارة للوصول إلى لوحة التحكم
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
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

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button
              onClick={handleLogin}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
