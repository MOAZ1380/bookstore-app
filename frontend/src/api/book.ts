import axiosClient from './axiosClient';

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  discount: number;
  coverImage?: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  discount?: number;
}

export interface UpdateBookDto {
  title?: string;
  author?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  discount?: number;
}

/** ====== Books CRUD ====== */
export const getAllBooks = async (page: number = 1, limit: number = 10) => {
  try {
    const res = await axiosClient.get('book', { params: { limit, page } });
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to fetch books:', err.response?.data || err.message);
    return { success: false, message: 'فشل تحميل الكتب' };
  }
};

export const getBookById = async (id: number) => {
  try {
    const res = await axiosClient.get(`book/${id}`);
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to fetch book:', err.response?.data || err.message);
    return { success: false, message: 'فشل تحميل الكتاب' };
  }
};

export const getBooksByCategory = async (categoryId: number, page: number = 1, limit: number = 10) => {
  try {
    const res = await axiosClient.get(`book/category/${categoryId}`, { params: { page, limit } });
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to fetch books by category:', err.response?.data || err.message);
    return { success: false, message: 'فشل تحميل الكتب حسب التصنيف' };
  }
};

export const createBook = async (data: FormData) => {
  try {
    const res = await axiosClient.post('book', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to create book:', err.response?.data || err.message);
    return { success: false, message: 'فشل إنشاء الكتاب' };
  }
};

export const updateBook = async (id: number, data: FormData) => {
  try {
    const res = await axiosClient.patch(`book/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to update book:', err.response?.data || err.message);
    return { success: false, message: 'فشل تحديث الكتاب' };
  }
};

export const deleteBook = async (id: number) => {
  try {
    const res = await axiosClient.delete(`book/${id}`);
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to delete book:', err.response?.data || err.message);
    const msg = err.response?.data?.message || 'فشل حذف الكتاب';
    return { success: false, message: msg };
  }
};

/** ====== Book Discounts ====== */
export const updateAllBooksDiscount = async (discount: number) => {
  try {
    const res = await axiosClient.patch('book/discount', { discount });
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to update all books discount:', err.response?.data || err.message);
    return { success: false, message: 'فشل تحديث الخصومات' };
  }
};

export const updateBookDiscount = async (id: number, discount: number) => {
  try {
    const res = await axiosClient.patch(`book/discount/${id}`, { discount });
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to update book discount:', err.response?.data || err.message);
    return { success: false, message: 'فشل تحديث خصم الكتاب' };
  }
};

export const clearAllBooksDiscount = async () => {
  try {
    const res = await axiosClient.patch('book/clear-discount');
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to clear all books discount:', err.response?.data || err.message);
    return { success: false, message: 'فشل إزالة الخصومات' };
  }
};

export const clearBookDiscount = async (id: number) => {
  try {
    const res = await axiosClient.patch(`book/clear-discount/${id}`);
    return { success: true, data: res.data };
  } catch (err: any) {
    console.error('Failed to clear book discount:', err.response?.data || err.message);
    return { success: false, message: 'فشل إزالة خصم الكتاب' };
  }
};
