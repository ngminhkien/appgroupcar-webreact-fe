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
