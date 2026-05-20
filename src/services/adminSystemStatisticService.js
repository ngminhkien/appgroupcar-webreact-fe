import axiosInstance from '@/services/axiosInstance';

export const getActiveUsersApi = async () => {
  const response = await axiosInstance.get('/AdminSystemStatistic/active-users');
  return response.data;
};

export const getActiveDriversApi = async () => {
  const response = await axiosInstance.get('/AdminSystemStatistic/active-drivers');
  return response.data;
};

export const getActiveVehiclesApi = async () => {
  const response = await axiosInstance.get('/AdminSystemStatistic/active-vehicles');
  return response.data;
};

export const getSuccessfulOffersApi = async (startDate, endDate) => {
  const response = await axiosInstance.post('/AdminSystemStatistic/successful-offers', { startDate, endDate });
  return response.data;
};

export const getSuccessfulOrdersApi = async (startDate, endDate) => {
  const response = await axiosInstance.post('/AdminSystemStatistic/successful-orders', { startDate, endDate });
  return response.data;
};

export const getTotalRevenueApi = async (startDate, endDate) => {
  const response = await axiosInstance.post('/AdminSystemStatistic/total-revenue', { startDate, endDate });
  return response.data;
};

export const getNewUsersApi = async (startDate, endDate) => {
  const response = await axiosInstance.post('/AdminSystemStatistic/new-users', { startDate, endDate });
  return response.data;
};

export const getNewDriversApi = async (startDate, endDate) => {
  const response = await axiosInstance.post('/AdminSystemStatistic/new-drivers', { startDate, endDate });
  return response.data;
};

