import axiosInstance from '@/services/axiosInstance';

export const getBusRoutesApi = async (params) => {
  const response = await axiosInstance.get('/bus-routes', { params });
  return response.data;
};

export const createBusRouteApi = async (data) => {
  const response = await axiosInstance.post('/bus-routes', data);
  return response.data;
};
