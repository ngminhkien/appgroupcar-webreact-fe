import axiosInstance from '@/services/axiosInstance';

export const getLocationsApi = async (params) => {
  const response = await axiosInstance.get('/locations', { params });
  return response.data;
};

export const getAvailableLocationsForRouteApi = async (params) => {
  const response = await axiosInstance.get('/locations/available-for-route', { params });
  return response.data;
};
