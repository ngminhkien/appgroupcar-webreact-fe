import axiosInstance from '@/services/axiosInstance';

export const getBusRoutesApi = async (params) => {
  const response = await axiosInstance.get('/bus-routes', { params });
  return response.data;
};

export const createBusRouteApi = async (data) => {
  const response = await axiosInstance.post('/bus-routes', data);
  return response.data;
};

export const getBusRouteByIdApi = async (id) => {
  const response = await axiosInstance.get(`/bus-routes/${id}`);
  return response.data;
};

export const updateBusRouteApi = async (id, data) => {
  const response = await axiosInstance.put(`/bus-routes/${id}`, data);
  return response.data;
};

export const deleteBusRouteApi = async (id) => {
  const response = await axiosInstance.delete(`/bus-routes/${id}`);
  return response.data;
};
