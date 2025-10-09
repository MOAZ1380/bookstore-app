import axios from 'axios';
import Cookies from 'js-cookie';
import axiosClient from './axiosClient';

// ==================== BASE URL ====================
const API_URL = 'http://localhost:5000/api/v1/'; // غيّرها حسب إعداد السيرفر

// ==================== REGISTER ====================
export async function registerUser(email: string, password: string) {
  try {
    const response = await axiosClient.post(`auth/signUp`, {
      email,
      password,
    });
   ;

    const { token, user } = response.data;
    Cookies.remove('token');
    Cookies.set('token', token, { expires: 7 });

    return { success: true, data: { user, token } };
  } catch (error: any) {
    console.error('Registration failed:', error.response?.data || error.message);

    if (error.response) {
      const status = error.response.status;
      if (status === 409) {
        return { success: false, message: 'This email is already in use' };
      } else if (status === 400 || status === 401) {
        return { success: false, message: 'Invalid registration data' };
      }
    }

    return { success: false, message: 'Server connection error' };
  }
}

// ==================== LOGIN ====================
export async function loginUser(email: string, password: string) {
  try {
    const response = await axiosClient.post(`auth/signIn`, {
      email,
      password,
    });

    const { token, user } = response.data;
    Cookies.remove('token');
    Cookies.set('token', token, { expires: 7 });

    return { success: true, data: { user, token } };
  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message);

    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        return { success: false, message: 'Invalid email or password' };
      } else if (status === 400) {
        return { success: false, message: 'Invalid login data' };
      }
    }

    return { success: false, message: 'Server connection error' };
  }
}

// ==================== CREATE USER (Optional) ====================
export async function createUser(name: string, email: string, password: string) {
  try {
    const response = await axiosClient.post(`auth/signUp`, {
      name,
      email,
      password,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('User creation failed:', error.response?.data || error.message);
    return { success: false, message: 'User creation failed' };
  }
}

// ==================== GET CURRENT USER ====================
export async function getCurrentUser() {
  try {
    const token = Cookies.get('token');
    if (!token) return null;

    const response = await axiosClient.get(`auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch {
    return null;
  }
}

// ==================== LOGOUT ====================
export function logoutUser() {
  Cookies.remove('token');
}
