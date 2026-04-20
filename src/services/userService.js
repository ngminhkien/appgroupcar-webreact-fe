import axiosInstance from '@/services/axiosInstance';

/**
 * @typedef {import('@/types/userRequestParams').UserListRequestParams} UserListRequestParams
 */

/**
 * Get paged users for system admin page.
 * @param {UserListRequestParams} params
 */
export const getUsersApi = async (params) => {
  const response = await axiosInstance.get('/user', { params });
  return response.data;
};

/**
 * Get user detail by ID.
 * @param {string} id
 */
export const getUserByIdApi = async (id) => {
  const response = await axiosInstance.get(`/user/${id}`);
  return response.data;
};

/**
 * Update a user by ID.
 * Sends multipart/form-data with fullName, phoneNumber, ImgFile.
 * @param {string} id
 * @param {FormData} formData
 */
export const updateUserApi = async (id, formData) => {
  const response = await axiosInstance.put(`/user/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Delete a user by ID.
 * @param {string} id
 */
export const deleteUserApi = async (id) => {
  const response = await axiosInstance.delete(`/user/${id}`);
  return response.data;
};

/**
 * Get current logged in user profile.
 */
export const getUserProfileApi = async () => {
  const response = await axiosInstance.get('/user/me');
  return response.data;
};
