import axios from "axios";

export function handleApiError(error: unknown): string {
  // إذا الخطأ من Axios (يعني من السيرفر أو الشبكة)
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    // لو السيرفر رجّع رسالة واضحة
    if (data?.message) {
      return data.message;
    }

    switch (status) {
      case 400:
        return "طلب غير صالح. تأكد من البيانات المدخلة.";
      case 401:
        return "يجب تسجيل الدخول لإتمام هذه العملية.";
      case 403:
        return "ليس لديك صلاحية للوصول إلى هذا المورد.";
      case 404:
        return "العنصر المطلوب غير موجود أو لم يتم العثور عليه.";
      case 409:
        return "حدث تعارض في البيانات. ربما تم إرسال الطلب مسبقًا.";
      case 500:
        return "حدث خطأ داخلي في الخادم. حاول لاحقًا.";
      default:
        return "حدث خطأ غير متوقع. حاول مرة أخرى.";
    }
  }

  return "حدث خطأ أثناء تنفيذ العملية. تحقق من الاتصال بالإنترنت.";
}
