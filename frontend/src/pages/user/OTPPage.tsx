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
import { Page } from "../../types";

interface OTPPageProps {
  navigateTo: (page: Page) => void;
  otpCode: string;
  setOtpCode: (otpCode: string) => void;
}

export const OTPPage = ({ navigateTo, otpCode, setOtpCode }: OTPPageProps) => (
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
          <CardTitle className="text-2xl">رمز التحقق</CardTitle>
          <p className="text-gray-600">
            أدخل الرمز المرسل إلى بريدك الإلكتروني
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>رمز التحقق (6 أرقام)</Label>
            <div className="flex justify-center space-x-2 space-x-reverse">
              {[...Array(6)].map((_, i) => (
                <Input
                  key={i}
                  className="w-12 h-12 text-center text-lg"
                  maxLength={1}
                  onChange={(e) => {
                    const newOtp = otpCode.split("");
                    newOtp[i] = e.target.value;
                    setOtpCode(newOtp.join(""));
                  }}
                />
              ))}
            </div>
          </div>
          <Button
            onClick={() => navigateTo("reset-password")}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            تأكيد الرمز
          </Button>
          <div className="text-center">
            <span className="text-gray-600">لم تتلقى الرمز؟ </span>
            <button className="text-purple-600 hover:underline">
              إعادة الإرسال
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
