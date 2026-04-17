import axiosInstance from './axiosInstance';

/**
 * Login API
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
export const loginApi = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  // Backend shape: { code: 200, message: "Login success", data: { accessToken, refreshToken } }
  return response.data;
};
