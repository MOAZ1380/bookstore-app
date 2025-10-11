import axiosClient from "./axiosClient";

export const getAllCategories = async () => {
    try {
        const response = await axiosClient.get(`category`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Failed to fetch categories:', error.response?.data || error.message);
        return { success: false, message: 'Failed to fetch categories' };
    }
}

export const getBooksByCategory = async (categoryId: number, page: number = 1, limit: number = 10) => {
    try {
        const response = await axiosClient.get(`book/category/${categoryId}`, { params: { page, limit } });
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Failed to fetch books by category:', error.response?.data || error.message);
        return { success: false, message: 'Failed to fetch books by category' };
    }
}

export const createCategory = async (data: any) => {
    try {
        const category = await axiosClient.post(`category`, data);
        return {success: true, data: category.data};
    } catch (error: any) {
        console.error('Failed to create category:', error.response?.data || error.message);
        return { success: false, message: 'Failed to create category' };
    }
}

export const updateCategory = async (id: number, data: any) => {
    try {
        const category = await axiosClient.patch(`category/${id}`, data);
        return {success: true, data: category.data};
    } catch (error: any) {
        console.error('Failed to update category:', error.response?.data || error.message);
        return { success: false, message: 'Failed to update category' };
    }
}

export const deleteCategory = async (id: number) => {
    try {
        const response = await axiosClient.delete(`category/${id}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Failed to delete category:', error.response?.data || error.message);
        return { success: false, message: 'Failed to delete category' };
    }
}


export const getCategoryById = async (id: number) => {
    try {
        const response = await axiosClient.get(`category/${id}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error('Failed to fetch category:', error.response?.data || error.message);
        return { success: false, message: 'Failed to fetch category' };
    }
}