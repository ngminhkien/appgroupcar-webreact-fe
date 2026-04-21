import axiosInstance from './axiosInstance';

/**
 * Register API
 * @param {object} userData
 * @param {string} userData.fullName
 * @param {string} userData.email
 * @param {string} userData.phoneNumber
 * @param {string} userData.password
 */
export const registerApi = async (userData) => {
  const formData = new FormData();
  formData.append('FullName', userData.fullName);
  formData.append('Email', userData.email);
  formData.append('PhoneNumber', userData.phoneNumber);
  formData.append('Password', userData.password);

  const response = await axiosInstance.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

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

/**
 * Logout API
 * @param {string} refreshToken
 */
export const logoutApi = async (refreshToken) => {
  const response = await axiosInstance.post('/auth/logout', { refreshToken });
  return response.data;
};
