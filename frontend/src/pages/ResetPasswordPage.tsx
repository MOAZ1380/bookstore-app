import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Book } from 'lucide-react';
import { Page } from '../types';

interface ResetPasswordPageProps {
  navigateTo: (page: Page) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const ResetPasswordPage = ({ navigateTo, setIsLoggedIn }: ResetPasswordPageProps) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
    <div className="max-w-md w-full mx-4">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">إعادة تعيين كلمة المرور</CardTitle>
          <p className="text-gray-600">أدخل كلمة المرور الجديدة</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="أدخل كلمة المرور الجديدة"
              className="text-right"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">تأكيد كلمة المرور الجديدة</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              placeholder="أعد إدخال كلمة المرور الجديدة"
              className="text-right"
              dir="rtl"
            />
          </div>
          <Button
            onClick={() => {
              setIsLoggedIn(true);
              navigateTo('home');
            }}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            حفظ كلمة المرور الجديدة
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);