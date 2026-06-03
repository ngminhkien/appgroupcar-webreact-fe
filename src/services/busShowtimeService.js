import axiosInstance from '@/services/axiosInstance';

export const getBusShowtimesApi = async (params) => {
  const response = await axiosInstance.get('/bus-showtimes', { params });
  return response.data;
};

export const createBusShowtimeApi = async (data) => {
  const response = await axiosInstance.post('/bus-showtimes', data);
  return response.data;
};

export const updateBusShowtimeApi = async (id, data) => {
  const response = await axiosInstance.put(`/bus-showtimes/${id}`, data);
  return response.data;
};

export const getBusShowtimeByIdApi = async (id) => {
  const response = await axiosInstance.get(`/bus-showtimes/${id}`);
  return response.data;
};

export const deleteBusShowtimeApi = async (id) => {
  const response = await axiosInstance.delete(`/bus-showtimes/${id}`);
  return response.data;
};

export const searchBusShowtimesApi = async (params) => {
  const response = await axiosInstance.get('/bus-showtimes/search', { params });
  return response.data;
};

