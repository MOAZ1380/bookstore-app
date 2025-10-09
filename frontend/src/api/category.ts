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