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
