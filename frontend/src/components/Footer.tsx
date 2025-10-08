import { Book } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  navigateTo: (page: Page) => void;
}

export const Footer = ({ navigateTo }: FooterProps) => (
  <footer className="bg-gray-900 text-white mt-8 sm:mt-16" dir="rtl">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-s-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <div className="flex items-center space-x-3 sm:space-x-4 space-x-reverse mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Book className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold">عالم الكتب استور</h2>
          </div>
          <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
            أكبر متجر إلكتروني للكتب العربية. نوفر لك آلاف الكتب في جميع المجالات بأفضل الأسعار وأسرع خدمة توصيل.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-3 sm:mb-4">روابط سريعة</h3>
          <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
            <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">الرئيسية</button></li>
            <li><button onClick={() => navigateTo('categories')} className="hover:text-white transition-colors">التصنيفات</button></li>
            <li><button className="hover:text-white transition-colors">عن المكتبة</button></li>
            <li><button className="hover:text-white transition-colors">تواصل معنا</button></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-3 sm:mb-4">خدمة العملاء</h3>
          <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
            <li><button className="hover:text-white transition-colors">الأسئلة الشائعة</button></li>
            <li><button className="hover:text-white transition-colors">سياسة الإرجاع</button></li>
            <li><button className="hover:text-white transition-colors">طرق الدفع</button></li>
            <li><button className="hover:text-white transition-colors">الشحن والتوصيل</button></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
        <p className="text-sm sm:text-base">&copy; 2024 عالم الكتب استور. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  </footer>
);