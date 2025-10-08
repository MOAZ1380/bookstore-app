import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Settings } from 'lucide-react';
import { Page } from '../../types';

interface AdminLoginPageProps {
  navigateTo: (page: Page) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const AdminLoginPage = ({ navigateTo, setIsAdmin }: AdminLoginPageProps) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
    <div className="max-w-md w-full mx-4">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">تسجيل دخول الإدارة</CardTitle>
          <p className="text-gray-600">أدخل بيانات الإدارة للوصول إلى لوحة التحكم</p>
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
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              placeholder="أدخل كلمة المرور"
              className="text-right"
              dir="rtl"
            />
          </div>
          <Button
            onClick={() => {
              setIsAdmin(true);
              navigateTo('admin-dashboard');
            }}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            تسجيل الدخول
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);