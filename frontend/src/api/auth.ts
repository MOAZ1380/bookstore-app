import Cookies from 'js-cookie';
import axiosClient from './axiosClient';


export async function registerUser(email: string, password: string) {
  try {
    const response = await axiosClient.post(`auth/signUp`, {
      email,
      password,
    });

    const { token, user } = response.data;

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

export async function loginUser(email: string, password: string) {
  try {
    const response = await axiosClient.post(`auth/signIn`, {
      email,
      password,
    });

    const { token, user } = response.data;

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

export function logoutUser() {
  Cookies.remove('token');
}
