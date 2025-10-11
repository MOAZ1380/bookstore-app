import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Book } from "lucide-react";
import { Page } from "../types";

interface ForgotPasswordPageProps {
  navigateTo: (page: Page) => void;
}

export const ForgotPasswordPage = ({ navigateTo }: ForgotPasswordPageProps) => (
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
          <CardTitle className="text-2xl">نسيت كلمة المرور؟</CardTitle>
          <p className="text-gray-600">
            أدخل بريدك الإلكتروني لإرسال رمز التحقق
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
            />
          </div>
          <Button
            onClick={() => navigateTo("otp")}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            إرسال رمز التحقق
          </Button>
          <div className="text-center">
            <button
              onClick={() => navigateTo("login")}
              className="text-purple-600 hover:underline"
            >
              العودة إلى تسجيل الدخول
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
