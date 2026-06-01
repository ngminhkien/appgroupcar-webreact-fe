import axiosInstance from '@/services/axiosInstance';

export const getLocationsApi = async (params) => {
  const response = await axiosInstance.get('/locations', { params });
  return response.data;
};
