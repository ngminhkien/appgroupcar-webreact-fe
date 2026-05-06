import axiosInstance from '@/services/axiosInstance';

export const getLocationsApi = async (params) => {
  const response = await axiosInstance.get('/location', { params });
  return response.data;
};
