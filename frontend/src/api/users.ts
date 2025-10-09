import axiosClient from "./axiosClient";

const USERS_BASE_URL = "users";

// ✅ فقط الـ Admin يقدر ينشئ مستخدم جديد
export async function createUser(data: any) {
  const response = await axiosClient.post(USERS_BASE_URL, data);
  return response.data;
}

// ✅ فقط الـ Admin يقدر يشوف كل المستخدمين
export async function getAllUsers() {
  const response = await axiosClient.get(USERS_BASE_URL);
  return response.data;
}

// ✅ المستخدم الحالي (User أو Admin)
export async function getLoggedUser() {
  const response = await axiosClient.get(`${USERS_BASE_URL}/me`);
  return response.data;
}

// ✅ تحديث باسورد المستخدم الحالي
export async function updateMyPassword() {
  const response = await axiosClient.patch(`${USERS_BASE_URL}/updateMyPassword`);
  return response.data;
}

// ✅ تحديث بيانات المستخدم الحالي
export async function updateMe(data: any) {
  const response = await axiosClient.patch(`${USERS_BASE_URL}/updateMe`, data);
  return response.data;
}

// ✅ حذف حساب المستخدم الحالي
export async function deleteMyAccount() {
  const response = await axiosClient.patch(`${USERS_BASE_URL}/DeleteMyAccount`);
  return response.data;
}

export async function getUserById(id: number) {
  const response = await axiosClient.get(`${USERS_BASE_URL}/${id}`);
  return response.data;
}

export async function updateUser(id: number, data: any) {
  const response = await axiosClient.patch(`${USERS_BASE_URL}/${id}`, data);
  return response.data;
}

export async function deleteUser(id: number) {
  const response = await axiosClient.delete(`${USERS_BASE_URL}/${id}`);
  return response.data;
}
