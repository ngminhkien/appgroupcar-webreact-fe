import axiosInstance from '@/services/axiosInstance';

/**
 * @typedef {import('@/types/driverRequestParams').DriverListRequestParams} DriverListRequestParams
 */

/**
 * Get paged market drivers.
 * @param {DriverListRequestParams} params
 */
export const getMarketDriversApi = async (params) => {
  const response = await axiosInstance.get('/marketDriver', { params });
  return response.data;
};

/**
 * Get a market driver layout detail by ID
 * @param {string} id - Driver ID.
 */
export const getDriverByIdApi = async (id) => {
  const response = await axiosInstance.get(`/marketDriver/${id}`);
  return response.data;
};

/**
 * Approve or reject a market driver.
 * @param {string} userId - Driver User ID.
 */
export const approveDriverApi = async (userId) => {
  const response = await axiosInstance.patch('/marketDriver/approval', null, {
    params: { userId }
  });
  return response.data;
};

/**
 * Refuse a market driver.
 * @param {string} userId - Driver User ID.
 */
export const refuseDriverApi = async (userId) => {
  const response = await axiosInstance.patch('/marketDriver/refuse', null, {
    params: { userId }
  });
  return response.data;
};

/**
 * Lock a driver by ID.
 * @param {string} id
 */
export const lockDriverApi = async (id) => {
  const response = await axiosInstance.put(`/marketDriver/${id}/lock`);
  return response.data;
};

/**
 * Unlock a driver by ID.
 * @param {string} id
 */
export const unlockDriverApi = async (id) => {
  const response = await axiosInstance.put(`/marketDriver/${id}/unlock`);
  return response.data;
};

/**
 * Get current logged in driver info.
 */
export const getMarketDriverMeApi = async () => {
  const response = await axiosInstance.get('/marketDriver/me');
  return response.data;
};

/**
 * Register as a new driver.
 * @param {FormData} formData
 */
export const createMarketDriverApi = async (formData) => {
  const response = await axiosInstance.post('/marketDriver', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};


