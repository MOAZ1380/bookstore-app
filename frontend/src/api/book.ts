import axiosClient from "./axiosClient";

export const getAllBooks = async () => {
  try {
    const response = await axiosClient.get(`book`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Failed to fetch books:', error.response?.data || error.message);
    return { success: false, message: 'Failed to fetch books' };
  }
};
