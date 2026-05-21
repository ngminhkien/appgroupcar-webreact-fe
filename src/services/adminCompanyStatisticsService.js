import axiosInstance from '@/services/axiosInstance';

/**
 * Admin Company Statistics Service
 * Calls POST /revenue to fetch total passengers and revenue.
 * 
 * @param {object} params
 * @param {string} params.companyId
 * @param {string} params.startDate
 * @param {string} params.endDate
 */
export const getRevenueApi = async ({ companyId, startDate, endDate }) => {
  const response = await axiosInstance.post('/AdminCompanyStatistics/revenue', { companyId, startDate, endDate });
  return response.data;
};

export const getCompletedShowtimeCountApi = async ({ companyId, startDate, endDate }) => {
  const response = await axiosInstance.post('/AdminCompanyStatistics/completed-showtime-count', { companyId, startDate, endDate });
  return response.data;
};

const AdminCompanyStatistics = {
  getRevenueApi,
  getCompletedShowtimeCountApi
};

export default AdminCompanyStatistics;
